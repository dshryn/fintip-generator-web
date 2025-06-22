
const express = require('express');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');
const financeLogic = require('./financeLogic');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'frontend')));

let openai;
if (process.env.OPENAI_API_KEY) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    openai = new OpenAIApi(configuration);
}

app.post('/api/tips', async (req, res) => {
    try {
        const { income, expenses, savings } = req.body;
        if (
            income == null || expenses == null || savings == null ||
            isNaN(income) || isNaN(expenses) || isNaN(savings)
        ) {
            return res.status(400).json({ error: 'Invalid input – provide numeric income, expenses, and savings.' });
        }

        let tip;
        if (openai) {
            const prompt = financeLogic.createPrompt(income, expenses, savings);
            const completion = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful personal finance assistant. Provide actionable money-saving and budgeting advice.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 150,
                temperature: 0.7
            });
            tip = completion.data.choices[0].message.content.trim();
        } else {
            tip = financeLogic.fallbackTip(income, expenses, savings);
        }
        return res.json({ tip });
    } catch (error) {
        console.error('Error generating tip:', error);
        const fallback = financeLogic.fallbackTip(req.body.income, req.body.expenses, req.body.savings);
        return res.status(500).json({ error: 'Server error; providing fallback advice.', tip: fallback });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});