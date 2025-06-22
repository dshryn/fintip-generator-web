
function createPrompt(income, expenses, savings) {
    return `I have a monthly income of $${income}, monthly expenses of $${expenses}, and I want to save $${savings} per month. What personal finance advice would you give me to reach my savings goals and manage my money better?`;
}

function fallbackTip(income, expenses, savings) {
    const netIncome = income - expenses;
    let advice = "General advice: ";
    if (netIncome <= 0) {
        advice += "Your expenses are equal to or exceed your income. Carefully review and cut unnecessary spending (e.g., subscriptions, dining out). Try to reduce debt and increase income so you can budget effectively.";
    } else if (savings > netIncome) {
        advice += `Your savings goal ($${savings}) exceeds your available surplus ($${netIncome}). You may need to adjust your goal or increase savings: consider cutting expenses further or finding ways to boost income.`;
    } else {
        const savePct = ((netIncome / income) * 100).toFixed(1);
        advice += `You have a surplus of $${netIncome}/month (${savePct}% of income) after expenses. Continue budgeting wisely: build an emergency fund, track spending, and allocate more of your surplus towards your $${savings} savings goal.`;
    }
    return advice;
}

module.exports = { createPrompt, fallbackTip };