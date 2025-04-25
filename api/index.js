// Serverless function to handle API requests in Vercel
const { createProxyMiddleware } = require('http-proxy-middleware');

// Proxy configuration
const apiProxy = createProxyMiddleware({
  target: process.env.API_URL || 'https://habitnest-api.onrender.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/': '/'
  },
  headers: {
    'Connection': 'keep-alive'
  }
});

// Export the serverless function
module.exports = (req, res) => {
  // Don't allow browser caching of API responses
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return apiProxy(req, res);
}; 