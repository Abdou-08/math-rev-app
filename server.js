const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mistral AI API configuration
const MISTRAL_API_KEY = 'NMujwXew4ok69cAGTCAuKSjKNSeNWp6s';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'No message provided' });

    try {
        const response = await axios.post(
            MISTRAL_API_URL,
            {
                model: 'mistral-small',
                messages: [
                    {
                        role: 'system',
                        content: 'أجب دائمًا باللغة العربية'
                    },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 800
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MISTRAL_API_KEY}`
                }
            }
        );

        res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error with Mistral AI API:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to get response from AI service',
            details: process.env.NODE_ENV === 'development' ? error.response?.data || error.message : undefined
        });
    }
});

// 👇 Directly use process.env.PORT or 3000
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});
