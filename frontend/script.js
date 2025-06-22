

document.getElementById('tipForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const income = parseFloat(document.getElementById('income').value);
    const expenses = parseFloat(document.getElementById('expenses').value);
    const savings = parseFloat(document.getElementById('savings').value);

    const resultCard = document.getElementById('result');
    const tipText = document.getElementById('tipText');
    const loader = document.getElementById('loader');
    resultCard.classList.add('hidden');
    tipText.textContent = '';
    loader.classList.remove('hidden');

    try {
        const response = await fetch('/api/tips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ income, expenses, savings })
        });
        const data = await response.json();

        if (response.ok) {
            tipText.textContent = data.tip;
        } else {
            tipText.textContent = data.error || 'An error occurred.';
        }
    } catch (err) {
        tipText.textContent = 'Failed to fetch tip.';
        console.error(err);
    } finally {
        loader.classList.add('hidden');
        resultCard.classList.remove('hidden');
        resultCard.classList.add('fade-in');
        setTimeout(() => resultCard.classList.remove('fade-in'), 1000);
    }
});