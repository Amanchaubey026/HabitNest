import express from 'express';
import { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

// Mistral AI API endpoint
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_API_KEY = 'H7bFbKwRdHUUMrhjxqvDKp7dLjEVlfD0'; // In production, this should be in an environment variable

// Handle chat request
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages are required and must be an array' });
    }

    // Set up headers for streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Make request to Mistral API
    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: 'mistral-tiny', // Use the appropriate model
        messages,
        stream: true,
        max_tokens: 2000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        },
        responseType: 'stream',
      }
    );

    // Forward the streamed response to the client
    response.data.pipe(res);

    // Handle errors in the stream
    response.data.on('error', (error: Error) => {
      console.error('Stream error:', error);
      res.end(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`);
    });

  } catch (error: any) {
    console.error('Error calling Mistral API:', error);
    // For non-streaming errors
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Error processing request',
        details: error.message 
      });
    } else {
      // For errors after streaming started
      res.write(`data: ${JSON.stringify({ error: 'Error processing request' })}\n\n`);
      res.end();
    }
  }
});

// Simple non-streaming endpoint for simpler integration
router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Construct messages array for the API
    const messages = [
      ...history,
      { role: 'user', content: message }
    ];

    // Make request to Mistral API
    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: 'mistral-tiny',
        messages,
        max_tokens: 2000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        },
      }
    );

    // Return the completion response
    return res.json({ 
      response: response.data.choices[0]?.message?.content || 'No response generated',
      usage: response.data.usage
    });

  } catch (error: any) {
    console.error('Error calling Mistral API:', error);
    return res.status(500).json({ 
      error: 'Error processing request',
      details: error.message 
    });
  }
});

export default router; 