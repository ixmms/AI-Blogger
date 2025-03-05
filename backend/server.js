const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Add CORS support
require('dotenv').config();

const app = express();

// Use CORS middleware
app.use(cors());

// Allow JSON data to be sent
app.use(express.json());

// Define the port (use the environment variable or default to port 5002)
const PORT = process.env.PORT || 5002;

// Endpoint to generate a blog post from OpenAI API
app.post('/generate-blog', async (req, res) => {
  const { topic } = req.body;

  // Log the received topic
  console.log('Received topic:', topic);

  // Check if the topic is provided
  if (!topic) {
    console.log('No topic provided');
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    // Make the request to the OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',  // Using the new chat-completion endpoint
      {
        model: 'gpt-3.5-turbo',  // Change to the new model
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Write a blog post about ${topic}` },
        ],
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    // Log the OpenAI API response
    console.log('OpenAI API response:', response.data);

    const blogContent = response.data.choices[0].message.content;
    res.json({ blogContent });
  } catch (error) {
    console.error('Error with OpenAI API request:', error.message);
    res.status(500).json({ error: 'Error generating blog post' });
  }
});

// Server Initialization
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
