import type { Case, AIDecision } from '../models/types';

// Merchant-configurable safety policies
export const MerchantConfig = {
  HIGH_VALUE_THRESHOLD: 10000,
  MAX_RETRIES: 3,
  MIN_CONFIDENCE: 0.60
};

export class PolicyEngine {
  static evaluate(c: Case, decision: AIDecision): { passed: boolean; reason: string } {
    
    // 1. High Value Risk Guardrail
    if (
      c.transaction.amount > MerchantConfig.HIGH_VALUE_THRESHOLD && 
      decision.recommendedAction === 'RETRY_PAYMENT'
    ) {
      return { 
        passed: false, 
        reason: `Blocked by Policy: Transactions over ₹${MerchantConfig.HIGH_VALUE_THRESHOLD.toLocaleString()} require manual review or customer confirmation before retry.` 
      };
    }

    // 2. Retry Exhaustion Guardrail
    if (
      c.transaction.retryCount >= MerchantConfig.MAX_RETRIES && 
      decision.recommendedAction === 'RETRY_PAYMENT'
    ) {
      return { 
        passed: false, 
        reason: `Blocked by Policy: Maximum retry count (${MerchantConfig.MAX_RETRIES}) exceeded.` 
      };
    }

    // 3. AI Confidence Guardrail
    if (
      decision.confidence < MerchantConfig.MIN_CONFIDENCE && 
      decision.recommendedAction !== 'ESCALATE_HUMAN' && 
      decision.recommendedAction !== 'STOP'
    ) {
      return { 
        passed: false, 
        reason: `Blocked by Policy: AI confidence (${Math.round(decision.confidence * 100)}%) is below the merchant minimum threshold (${Math.round(MerchantConfig.MIN_CONFIDENCE * 100)}%).` 
      };
    }

    // 4. Churn Risk Communication Block
    if (
      c.customer.segment === 'CHURNING' && 
      (decision.recommendedAction === 'SEND_WHATSAPP' || decision.recommendedAction === 'SEND_EMAIL')
    ) {
       return {
         passed: false,
         reason: 'Blocked by Policy: Automated messaging paused for high-churn-risk customers. Escalate to human success manager.'
       }
    }

    return { passed: true, reason: 'Passed all merchant safety policies.' };
  }
}
