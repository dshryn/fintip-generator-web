# Personal Finance Tip Generator using Generative AI

A web application that delivers personalized, actionable budgeting advice by combining user inputs (income, expenses, savings goals, and spending habits) with both. generative AI (LLaMA-3 via Ollama) and rule-based finance heuristics (50/30/20 rule, emergency-fund guidelines). The frontend streams AI responses in real time with a typewriter animation and dynamic layout.


## Features

- **Real-time AI streaming**  
  Uses the Web Streams API to render incoming text chunks with a typewriter effect and blinking cursor.
- **Generative + Rule-based Hybrid**  
  Rich AI prompts combined with fallback logic implementing core finance rules when the model is unavailable.
- **Dynamic Layout**  
  Form card adjusts according to the output length.
- **Spending Habits Input**  
  Users can describe their spending behaviors (e.g., dining out, subscriptions) for tailored advice.



## ⚙️ Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/personal-finance-tip-generator.git
   cd personal-finance-tip-generator

2. **Install Backend Dependencies**
   ```bash
    cd backend
    npm install

3. **Run LLaMA-3 model via Ollama**
    ```bash
    ollama pull llama3
    ollama run llama3

4. Keep this terminal open and start the backend server
    ```bash
    cd backend
    node server.js
  
5. Open the presented link in your browser.



## Usage

- Enter your Monthly Income, Monthly Expenses, Savings Goal, and optional Spending Habits.
- Click Get Tip.
- Watch the loader spin, then see your personalized finance tip appear letter by letter.
- If the AI service is unavailable, you’ll receive a rule-based fallback tip immediately.
  

## Configuration

Ensure Ollama is installed and llama3 is pulled.
No API keys required for local LLaMA via Ollama.


## Testing
Unit tests (finance logic) can be added under backend/tests/ using your preferred test runner.

Integration - Simulate LLaMA downtime by stopping Ollama; verify fallback tips render.

Test various input edge cases.

## Future Enhancements

- Fine-tune LLaMA on finance corpora for improved domain accuracy.
- Add interactive budget visualizations (pie charts, progress bars).
- Persist user sessions & track long-term trends.
- Multi-language support (Hindi, Spanish).
- “Rate this tip” feedback loop for continuous improvement.


