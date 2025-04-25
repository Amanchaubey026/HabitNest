// Serverless function to handle API requests in Vercel
const { URL } = require('url');
const https = require('https');
const http = require('http');

// Target API URL
const API_BASE_URL = process.env.API_URL || 'https://habitnest-api.onrender.com';

// Export the serverless function
module.exports = async (req, res) => {
  try {
    // Don't allow browser caching of API responses
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    // Get the path from the request
    const url = new URL(API_BASE_URL + req.url.replace(/^\/api/, ''));
    
    // Determine whether to use http or https based on the URL
    const httpClient = url.protocol === 'https:' ? https : http;
    
    // Create options for the proxy request
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: req.method,
      headers: {
        ...req.headers,
        host: url.hostname
      }
    };
    
    // Create a proxy request
    const proxyReq = httpClient.request(options, proxyRes => {
      // Forward status code and headers from the API response
      res.statusCode = proxyRes.statusCode;
      Object.keys(proxyRes.headers).forEach(key => {
        res.setHeader(key, proxyRes.headers[key]);
      });
      
      // Stream the response data
      proxyRes.pipe(res);
    });
    
    // Forward request body if any
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      req.pipe(proxyReq);
    } else {
      proxyReq.end();
    }
    
    // Handle errors
    proxyReq.on('error', error => {
      console.error('Proxy request error:', error);
      res.status(500).json({ error: 'Failed to connect to API server' });
    });
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 