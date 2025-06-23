const form = document.getElementById('tipForm');
const loader = document.getElementById('loader');
const resultCard = document.getElementById('result');
const typedSpan = document.getElementById('typed');

let charBuffer = [];
let streamingDone = false;

async function typeWriter() {
    let firstChar = true;

    while (!streamingDone || charBuffer.length > 0) {
        if (charBuffer.length > 0) {
            // On the first character, switch from loader → result card
            if (firstChar) {
                loader.classList.add('hidden');
                resultCard.classList.remove('hidden');
                resultCard.classList.add('fade-in');
                firstChar = false;
            }

            typedSpan.textContent += charBuffer.shift();
        }
        await new Promise(r => setTimeout(r, 30));
    }
    // remove the cursor blink after complete
    typedSpan.classList.add('done');
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // reset
    typedSpan.textContent = '';
    typedSpan.classList.remove('done');
    charBuffer = [];
    streamingDone = false;
    resultCard.classList.add('hidden');
    loader.classList.remove('hidden');


    const income = parseFloat(document.getElementById('income').value);
    const expenses = parseFloat(document.getElementById('expenses').value);
    const savings = parseFloat(document.getElementById('savings').value);
    const habits = document.getElementById('habits').value.trim();

    typeWriter();

    try {
        const response = await fetch('/api/tips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ income, expenses, savings, habits }),
        });

        if (!response.ok) {
            const err = await response.text();
            for (const ch of `Error ${response.status}: ${err}`) charBuffer.push(ch);
            streamingDone = true;
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
            const { value, done } = await reader.read();
            if (value) {
                const chunk = decoder.decode(value, { stream: true });
                for (const ch of chunk) charBuffer.push(ch);
            }
            if (done) break;
        }
    } catch (err) {
        console.error('Fetch error:', err);
        for (const ch of 'Failed to fetch tip.') charBuffer.push(ch);
    } finally {
        streamingDone = true;
    }
});