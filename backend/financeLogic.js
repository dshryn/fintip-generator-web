
function createPrompt(income, expenses, savings, habits) {
    return `
I have a monthly income of ₹${income}, monthly expenses of ₹${expenses}, and I want to save ₹${savings} per month.
My current spending habits: ${habits || 'None provided'}.
Please give me clear, actionable personal finance advice that:
1. Follows all general finance rules and investment plans.
2. Prioritizes building an emergency fund.
3. Suggests ways to optimize the habits I provided.
4. Includes any simple money-saving or debt-paydown rules.
Give me a concise tip I can act on.
`.trim();
}

function fallbackTip(income, expenses, savings, habits) {
    const needsMax = income * 0.5;
    let advice = 'Failed to connect API. Here\'s a general advice: ';
    if (expenses > needsMax) {
        advice += `Your core expenses (₹${expenses}) exceed 50% of income. Try to cut needs costs (rent, bills). `;
    }
    if (savings < income * 0.2) {
        advice += `Aim to save at least 20% of income (₹${(income * 0.2).toFixed(0)}). `;
    }
    if (habits) {
        advice += `Also review these habits: ${habits}. `;
    }
    advice += 'Finally, build an emergency fund of 3-6 months of expenses.';
    return advice;
}

module.exports = { createPrompt, fallbackTip };
