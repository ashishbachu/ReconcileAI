import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import dotenv from 'dotenv';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

// Strict Zod Schema for validation
const AIDecisionSchema = z.object({
  diagnosis: z.string(),
  recoveryProbability: z.number().min(0).max(1),
  recommendedAction: z.enum(['RETRY_PAYMENT', 'SEND_PAYMENT_LINK', 'SEND_WHATSAPP', 'SEND_EMAIL', 'ESCALATE_HUMAN', 'STOP']),
  confidence: z.number().min(0).max(1),
  expectedRecovery: z.number().min(0),
  reason: z.string(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  requiresHumanReview: z.boolean(),
});

app.post('/api/ai/decide', async (req, res) => {
  const caseData = req.body;

  if (!genAI) {
    // Graceful offline fallback
    return res.status(503).json({ 
      error: 'GEMINI_API_KEY not configured on server', 
      fallbackAction: 'ESCALATE_HUMAN' 
    });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            diagnosis: { type: SchemaType.STRING },
            recoveryProbability: { type: SchemaType.NUMBER },
            recommendedAction: { 
              type: SchemaType.STRING, 
              enum: ['RETRY_PAYMENT', 'SEND_PAYMENT_LINK', 'SEND_WHATSAPP', 'SEND_EMAIL', 'ESCALATE_HUMAN', 'STOP'] 
            },
            confidence: { type: SchemaType.NUMBER },
            expectedRecovery: { type: SchemaType.NUMBER },
            reason: { type: SchemaType.STRING },
            riskLevel: { type: SchemaType.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] },
            requiresHumanReview: { type: SchemaType.BOOLEAN }
          },
          required: ['diagnosis', 'recoveryProbability', 'recommendedAction', 'confidence', 'expectedRecovery', 'reason', 'riskLevel', 'requiresHumanReview']
        }
      }
    });

    const prompt = `
      Analyze this failed payment case and recommend the optimal recovery action.
      Case context:
      - Transaction Amount: ${caseData.transaction.amount} INR
      - Failure Reason: ${caseData.transaction.failureReason}
      - Retry Count: ${caseData.transaction.retryCount}
      - Customer Segment: ${caseData.customer.segment}
      - Customer Lifetime Value: ${caseData.customer.lifetimeValue}
      - Previous Successful Payments: ${caseData.customer.previousSuccessfulPayments}
      - Previous Failed Payments: ${caseData.customer.previousFailedPayments}
      
      Provide a structured JSON response matching the schema.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse JSON
    const parsedData = JSON.parse(responseText);
    
    // STRICT ZOD VALIDATION
    const validatedData = AIDecisionSchema.parse(parsedData);

    res.json(validatedData);
  } catch (error) {
    console.error('AI Generation or Validation Failed:', error);
    // If validation fails or Gemini fails, return 400 or 500 but also a safe deterministic fallback
    res.status(500).json({ 
      error: 'AI output validation failed or generation error', 
      details: error.message,
      fallbackAction: 'ESCALATE_HUMAN'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend API Server running on port ${PORT}`);
});
