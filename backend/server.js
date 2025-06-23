

const express = require('express');
const path = require('path');
const axios = require('axios');
const financeLogic = require('./financeLogic');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.post('/api/tips', async (req, res) => {
    try {
        const { income, expenses, savings } = req.body;

        if (
            income == null || expenses == null || savings == null ||
            isNaN(income) || isNaN(expenses) || isNaN(savings)
        ) {
            return res.status(400).json({
                error: 'Invalid input - provide numeric income, expenses, and savings.'
            });
        }

        // Build the prompt
        const prompt = financeLogic.createPrompt(income, expenses, savings);
        let tip;

        try {
            const response = await axios.post(
                'http://localhost:11434/api/chat',
                {
                    model: 'llama3',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful personal finance assistant. Provide actionable money-saving and budgeting advice.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    stream: false
                },
                { timeout: 15000 }
            );

            // Extract the tip text
            if (response.data.choices && response.data.choices.length > 0) {
                tip = response.data.choices[0].message.content.trim();
            } else if (response.data.message) {
                tip = response.data.message.content.trim();
            } else {
                throw new Error('Unexpected Ollama response format');
            }
        } catch (err) {
            console.error('Ollama API error:', err.message);
            tip = financeLogic.fallbackTip(income, expenses, savings);
        }

        return res.json({ tip });
    } catch (error) {
        console.error('Server error:', error);
        const fallback = financeLogic.fallbackTip(
            req.body.income,
            req.body.expenses,
            req.body.savings
        );
        return res.status(500).json({
            error: 'Server error; providing fallback advice.',
            tip: fallback
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});