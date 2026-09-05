# RecoverAI

> An autonomous revenue recovery system that turns payment failures into measurable recovered revenue.

## 1. Problem
Payment failures happen constantly in modern digital businesses due to insufficient funds, bank timeouts, or card declines. Unrecovered payments lead directly to lost revenue and customer churn. Traditional solutions are static retry schedules or manual operations which are inefficient and costly.

## 2. Why revenue recovery matters
Recovering even 5-10% of failed payments goes straight to the bottom line. Intelligent recovery interventions protect customer lifetime value (LTV) and prevent involuntary churn without frustrating users.

## 3. Solution
RecoverAI is an AI-powered agent built for the Razorpay AI Buildathon that autonomously detects failed transactions, diagnoses the failure reason using customer context, decides on the optimal recovery strategy, safely executes the action through a policy engine, and logs the outcome.

## 4. Product workflow
1. **DETECT:** Identifies failed payments (revenue at risk).
2. **DIAGNOSE:** Analyzes the failure reason and customer profile.
3. **DECIDE:** Recommends a recovery intervention (Retry, WhatsApp, Email, Payment Link) with a confidence score.
4. **ACT:** Evaluates the decision against deterministic guardrails and simulates the execution.
5. **VERIFY:** Records the outcome (Success, Pending, Escalated).
6. **RECOVER:** Quantifies the recovered revenue.

## 5. Architecture
This MVP uses a "Modular Monolith" architecture built purely in the browser for instant demo capability without requiring backend deployment.
- **Frontend Layer:** React (Vite) + Zustand
- **Orchestrator:** Coordinates the decision/action loop.
- **AI Decision Engine:** Determines the optimal action based on heuristics simulating an LLM output.
- **Policy Engine:** Deterministic guardrails preventing unsafe actions (e.g., infinite retries).
- **Action Executor & Payment Provider:** Abstractions for executing payments/comms and simulating results.

## 6. AI Decision Engine
The agent receives structured context (transaction details, retry counts, failure reasons, customer LTV) and outputs a structured recommendation. It determines the probability of recovery and flags high-risk cases for human review.

## 7. Guardrails
AI decides; Policy authorizes. The policy engine ensures:
- No retries beyond maximum limits.
- No duplicate actions on already recovered payments.
- Enforced minimum thresholds for certain interventions.

## 8. Razorpay Integration
The application uses a `PaymentProvider` abstraction. Currently, `MockPaymentProvider` handles the simulated sandbox actions. This is cleanly separated, allowing an easy swap to real Razorpay Sandbox APIs (e.g., Payment Links, Smart Collect) using a backend proxy.

## 9. Evaluation Methodology
The agent is evaluated against a synthetic ground-truth dataset embedded within the application. The system strictly separates AI evaluation from simulated financial outcomes.

**1. Synthetic Ground Truth:**
Each case generates a deterministic `groundTruth` object (recoverability, optimal action, expected probabilities) based on customer history, segments, and failure reasons.

**2. AI Prediction Evaluation:**
The AI independently parses the context and predicts an outcome. This is evaluated purely on decision quality:
- **Precision & Recall (Eligibility)**: Accuracy in identifying recoverable cases.
- **False-Positive Rate**: The rate at which the AI attempts recovery on dead-ends.
- **Action Accuracy**: The % of time the AI selected the exact optimal action.

**3. Deterministic Outcome Simulation:**
Actual execution does **not** assume success just because the AI picked the right action. The `ActionExecutor` uses a seeded hash function (`transactionId + action`) against a dynamically calculated success probability to produce a strictly deterministic, reproducible outcome. 

**4. Financial Metrics (Available in Analytics):**
- **Revenue at Risk**: Total transaction value of failed payments.
- **Expected Recoverable**: The theoretical maximum recovery based on ground truth probabilities.
- **Actual Recovered**: The simulated revenue recovered by the deterministic executor.

*Note: This synthetic methodology allows for consistent demo reproducibility and metric evaluation. It is for hackathon benchmarking purposes and does not represent live production performance.*

## Architecture

```mermaid
graph TD
    A[Failed Payment] --> B[AIDecisionEngine (Gemini LLM)]
    B -->|Structured JSON| C{PolicyEngine Guardrails}
    C -->|Approved| D[ActionExecutor]
    C -->|Blocked| E[Escalate to Human]
    D -->|Adapter| F[Mock / RazorpayProvider]
    F --> G[Verification & AuditLog]
```

## Production & Live Mode
To run this in a real environment with live LLM intelligence:
1. Copy `.env.example` to `.env` (create the file).
2. Set your API keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```
3. If no Gemini API key is provided, the application gracefully falls back to a deterministic heuristic mock engine for a reliable offline demo experience.
4. The `RazorpayProvider` adapter is fully scaffolded and ready to process requests if keys are provided. Note: for client-side security in production, these keys must be moved to a backend proxy.

## 10. Dynamic Visualizations & Filtering
The application includes a rich interactive dashboard and analytics suite built with **Recharts**.
- **Interactive Charts:** Fully responsive Pie, Donut, and Bar charts for visualizing Recovery Statuses, Intervention Funnels, and Failure Reasons.
- **Dynamic Filtering:** Data can be sliced seamlessly by Date Range (e.g., Last 7 Days), Failure Reason, and Case Status. Filtering dynamically updates all KPI blocks, tables, and charts on the page.

## 11. Demo Instructions
1. Open the application (you will see the Dashboard with Revenue at Risk).
2. Click **"Run Recovery Agent"** to process the entire dataset in batch.
3. Observe the KPIs update as cases are recovered or escalated.
4. Navigate to **Active Recovery Cases** and open a specific case (View button).
5. Inspect the AI's Decision Summary, Confidence, Expected Recovery, and Guardrail checks.
6. Check the **Audit Log** for a complete trail of system actions.
7. View the **Analytics** page for performance metrics.

## 11. Project Structure
```
src/
├── components/     # Reusable UI components (Charts, Filters, etc.)
├── models/         # TypeScript interfaces (Case, Transaction, etc.)
├── pages/          # Main application views (Dashboard, Analytics, AuditLog)
├── services/       # Core business logic (aiDecisionEngine, actionExecutor, mock providers)
├── store/          # Zustand global state (useAppStore.ts)
└── utils/          # Helper functions and metric calculations
server.js           # Backend API for Gemini integration (optional)
```

## 12. Local Setup
```bash
npm install
npm run dev
```
To test a production build locally:
```bash
npm run build
npm run preview
```

## 13. Deployment Notes & Production Limitations
This application is currently an **MVP/prototype** designed for demonstration purposes.

**Current Implementation State:**
- **Intelligence:** The AI Decision Engine (`src/services/aiDecisionEngine.ts`) uses a **heuristic-based fallback** by default for reliability during demos. It is fully capable of using the Gemini API if `server.js` is run with a `GEMINI_API_KEY`, but this is not required.
- **Payments:** Payment execution is **simulated**. The `RazorpayProvider` adapter is scaffolded, but the app uses a `MockPaymentProvider` out-of-the-box.
- **Data:** The system uses **synthetic data** generated in the browser on load.
- **Financial Outcomes:** All recovered amounts and KPI metrics are **simulated**.

**Deployment Requirements:**
- **Frontend:** Can be deployed to any static host (Vercel, Netlify, Firebase Hosting) via `npm run build`.
- **Backend:** To enable live LLM integration, the `server.js` Express backend must be deployed (e.g., Google Cloud Run, Render) and provided with the `GEMINI_API_KEY`.
- **Security:** Do not expose `RAZORPAY_KEY_SECRET` in the frontend code or `.env`. This must be handled securely on the backend in a production environment.
