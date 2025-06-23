const express = require('express');
const path = require('path');
const axios = require('axios');
const financeLogic = require('./financeLogic');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(express.json());

app.post('/api/tips', async (req, res) => {
    const { income, expenses, savings, habits } = req.body;
    console.log(`[API] Received input: income=${income}, expenses=${expenses}, savings=${savings}, habits="${habits}"`);

    const inc = parseFloat(income),
        exp = parseFloat(expenses),
        sav = parseFloat(savings);

    if (
        isNaN(inc) || isNaN(exp) || isNaN(sav) ||
        inc < 0 || exp < 0 || sav < 0
    ) {
        console.error('[API] Invalid input values');
        return res.status(400).json({ error: 'Invalid input values' });
    }

    const prompt = financeLogic.createPrompt(inc, exp, sav, habits);
    console.log(`[API] Generated prompt for Ollama:\n${prompt}`);

    try {
        console.log('[API] Calling Ollama /api/generate with streaming...');
        const apiResponse = await axios({
            method: 'post',
            url: 'http://localhost:11434/api/generate',
            data: {
                model: 'llama3',
                prompt,
                stream: true
            },
            responseType: 'stream',
            timeout: 30000
        });

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Cache-Control', 'no-cache');
        res.flushHeaders();

        let buffer = '';
        apiResponse.data.on('data', chunk => {
            buffer += chunk.toString();
            const lines = buffer.split('\n');
            buffer = lines.pop();
            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const msg = JSON.parse(line);
                    if (msg.response) {
                        process.stdout.write(msg.response);
                        res.write(msg.response);
                    }
                } catch (err) {
                    console.error('[API] Failed to parse chunk:', err);
                }
            }
        });

        apiResponse.data.on('end', () => {
            console.log('[API] Ollama stream ended.');
            res.end();
        });

        apiResponse.data.on('error', err => {
            console.error('[API] Stream error:', err);
            const fallback = financeLogic.fallbackTip(inc, exp, sav, habits);
            res.write(fallback);
            res.end();
        });

    } catch (err) {
        console.error('[API] Ollama API request failed:', err.message);
        const fallback = financeLogic.fallbackTip(inc, exp, sav, habits);
        res.write(fallback);
        res.end();
    }
});

app.listen(PORT, () => {
    console.log(`[Server] Listening at: http://localhost:${PORT}`);
});
