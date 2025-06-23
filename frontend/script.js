

const form = document.getElementById('tipForm');
const loader = document.getElementById('loader');
const resultCard = document.getElementById('result');
const tipText = document.getElementById('tipText');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const income = parseFloat(document.getElementById('income').value);
    const expenses = parseFloat(document.getElementById('expenses').value);
    const savings = parseFloat(document.getElementById('savings').value);

    resultCard.classList.add('hidden');
    tipText.textContent = '';
    loader.classList.remove('hidden');

    try {
        const response = await fetch('/api/tips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ income, expenses, savings })
        });

        if (!response.ok) {
            const errText = await response.text();
            tipText.textContent = `Error ${response.status}: ${errText}`;
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
            const { value, done: readerDone } = await reader.read();
            if (value) {
                const chunk = decoder.decode(value, { stream: true });
                tipText.textContent += chunk;
            }
            done = readerDone;
        }

    } catch (err) {
        console.error('Fetch error:', err);
        tipText.textContent = 'Failed to fetch tip.';
    } finally {
        loader.classList.add('hidden');
        resultCard.classList.remove('hidden');
        resultCard.classList.add('fade-in');
        setTimeout(() => resultCard.classList.remove('fade-in'), 1000);
    }
});