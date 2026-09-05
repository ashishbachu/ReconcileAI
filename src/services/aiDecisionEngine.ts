import type { Case, AIDecision, ActionType } from '../models/types';

export class AIDecisionEngine {
  static async analyzeCase(c: Case): Promise<AIDecision> {
    try {
      const response = await fetch('/api/ai/decide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(c)
      });
      
      if (!response.ok) {
        throw new Error('API decision failed');
      }

      const data = await response.json();
      return data as AIDecision;
    } catch (err) {
      console.error('AI API failed, falling back to mock:', err);
      return this.mockAnalyzeCase(c);
    }
  }

  static mockAnalyzeCase(c: Case): AIDecision {
    const { transaction, customer } = c;

    let diagnosis = 'Unknown failure';
    let expectedRecovery = transaction.amount;
    let recoveryProbability = 0;
    let recommendedAction: ActionType = 'STOP';
    let confidence = 0;
    let reason = '';
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
    let requiresHumanReview = false;

    // Simulate AI Reasoning based on context
    if (transaction.status === 'SUCCESS') {
      return {
        diagnosis: 'Payment already successful.',
        recoveryProbability: 1,
        recommendedAction: 'STOP',
        confidence: 1,
        expectedRecovery: 0,
        reason: 'No action needed for successful payments.',
        riskLevel: 'LOW',
        requiresHumanReview: false,
      };
    }

    // Heuristics to simulate intelligent decisions
    if (transaction.failureReason === 'INSUFFICIENT_FUNDS') {
      diagnosis = 'Customer lacks funds at the moment of transaction.';
      if (customer.previousSuccessfulPayments > 5) {
        recoveryProbability = 0.8;
        recommendedAction = 'SEND_PAYMENT_LINK';
        confidence = 0.85;
        reason = 'High LTV customer with history of success; likely a temporary cash flow issue. Send link to pay when ready.';
      } else {
        recoveryProbability = 0.4;
        recommendedAction = 'SEND_WHATSAPP';
        confidence = 0.7;
        reason = 'Low history customer. Prompt via WhatsApp to arrange alternative payment.';
      }
    } else if (transaction.failureReason === 'BANK_TIMEOUT' || transaction.failureReason === 'NETWORK_ERROR') {
      diagnosis = 'Technical failure on the issuing bank side.';
      recoveryProbability = 0.95;
      recommendedAction = 'RETRY_PAYMENT';
      confidence = 0.9;
      reason = 'Network timeouts are typically transient. Safe to retry automatically.';
    } else if (transaction.failureReason === 'CARD_DECLINED' || transaction.failureReason === 'DO_NOT_HONOR') {
      diagnosis = 'Card actively declined by issuer.';
      if (transaction.amount > 5000) {
        recoveryProbability = 0.3;
        recommendedAction = 'ESCALATE_HUMAN';
        confidence = 0.95;
        reason = 'High-value transaction declined. High risk of churn. Human intervention required.';
        requiresHumanReview = true;
        riskLevel = 'HIGH';
      } else {
        recoveryProbability = 0.5;
        recommendedAction = 'SEND_EMAIL';
        confidence = 0.75;
        reason = 'Standard decline. Email customer to update payment method.';
      }
    } else if (transaction.failureReason === 'EXCEED_LIMIT') {
      diagnosis = 'Customer card limit exceeded.';
      recoveryProbability = 0.6;
      recommendedAction = 'SEND_PAYMENT_LINK';
      confidence = 0.8;
      reason = 'Send payment link so customer can use a different card or pay later.';
    } else {
       // generic
       diagnosis = 'Unspecified payment failure.';
       recoveryProbability = 0.5;
       recommendedAction = 'SEND_WHATSAPP';
       confidence = 0.6;
       reason = 'Reach out to customer to understand the issue.';
    }

    // Adjust based on retry count
    if (transaction.retryCount >= 2 && recommendedAction === 'RETRY_PAYMENT') {
        recommendedAction = 'ESCALATE_HUMAN';
        reason = 'Multiple retries already attempted. Escalating to prevent spam/blocks.';
        confidence = 0.85;
    }

    return {
      diagnosis,
      recoveryProbability,
      recommendedAction,
      confidence,
      expectedRecovery,
      reason,
      riskLevel,
      requiresHumanReview
    };
  }
}
