const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({}); 

async function explainDiscrepancy(bankRecord, aisRecord) {
  try {
    const prompt = `
You are a helpful assistant for KaroFile, an independent tax-information reconciliation tool for India.
The taxpayer has a discrepancy between their bank record and the tax information (AIS).

Bank Record: ${bankRecord.description}, Amount: ₹${bankRecord.amount}
Tax Record (AIS): ${aisRecord.description}, Amount: ₹${aisRecord.amount}

Explain the difference in amount in plain, concise language. 
Strict Guidelines:
1. Advise the user to verify the source document (like Form 16, interest certificate, etc.).
2. Do NOT give authoritative tax advice or definitively declare liability.
3. Keep it under 3 sentences.
`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "The AI explanation service is currently unavailable. Please verify the amount against your official source documents.";
  }
}

async function explainAmbiguousTransaction(transaction) {
  try {
    const prompt = `
You are a helpful assistant for KaroFile, an independent tax-information reconciliation tool for India.
The taxpayer has an ambiguous bank transaction that needs human review.

Transaction: ${transaction.description}
Amount: ₹${transaction.amount}
Category: ${transaction.category}

Explain in plain, concise language that the description is insufficient to determine its tax nature automatically.
Ask the user to manually verify if this is income, a personal transfer, a refund, or another category.
Strict Guidelines:
1. Do NOT automatically declare the transaction taxable.
2. Keep it under 3 sentences.
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "This transaction description is ambiguous. Please manually verify its nature as income, transfer, or refund.";
  }
}

module.exports = { explainDiscrepancy, explainAmbiguousTransaction };
