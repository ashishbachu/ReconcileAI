import type { Case, ActionType } from '../models/types';
import type { PaymentProvider } from './paymentProvider';

export class ActionExecutor {
  private provider: PaymentProvider;

  constructor(provider: PaymentProvider) {
    this.provider = provider;
  }

  async execute(c: Case, action: ActionType): Promise<{ success: boolean; resultStatus: Case['status']; recoveredAmount: number }> {
    const { transaction, customer, groundTruth } = c;

    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 300));

    // A simple deterministic pseudo-random hash generator [0, 1] based on string
    const stringHash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash) / 2147483647; // Normalize to roughly 0-1
    };

    // Calculate actual success probability based on case and action
    let successProbability = 0;

    if (groundTruth.isRecoverable) {
       // Start with base probability
       successProbability = groundTruth.expectedRecoveryProbability;

       // Adjust based on action synergy
       if (action === groundTruth.optimalAction) {
           successProbability += 0.2; // Boost for perfect action
       } else if (action === 'ESCALATE_HUMAN') {
           successProbability = 0.5; // Humans might fix anything, but it's coin flip
       } else if (action === 'STOP') {
           successProbability = 0;
       } else if (
         (groundTruth.optimalAction === 'SEND_PAYMENT_LINK' && action === 'SEND_WHATSAPP') ||
         (groundTruth.optimalAction === 'SEND_WHATSAPP' && action === 'SEND_PAYMENT_LINK')
       ) {
           successProbability -= 0.1; // Minor penalty for suboptimal but similar
       } else {
           successProbability -= 0.4; // Major penalty for wrong action
       }
       
       // Ensure bounds
       successProbability = Math.max(0, Math.min(1, successProbability));
    }

    // Hash the transaction ID and the action taken to get a deterministic roll
    const roll = stringHash(`${transaction.id}-${action}`);
    const successOutcome = roll <= successProbability;

    switch (action) {
      case 'RETRY_PAYMENT': {
        await this.provider.retryPayment(transaction.id);
        // We override the provider's mock with our ground truth for reproducibility
        if (successOutcome) {
          return { success: true, resultStatus: 'RECOVERED', recoveredAmount: transaction.amount };
        } else {
           return { success: false, resultStatus: 'FAILED', recoveredAmount: 0 };
        }
      }
      case 'SEND_PAYMENT_LINK': {
        await this.provider.createPaymentLink(transaction.amount, customer.id);
        if (successOutcome) {
          return { success: true, resultStatus: 'RECOVERED', recoveredAmount: transaction.amount };
        }
        return { success: true, resultStatus: 'PENDING', recoveredAmount: 0 };
      }
      case 'SEND_WHATSAPP': {
        await this.provider.sendWhatsApp(customer.id, 'Your payment failed...');
        if (successOutcome) {
          return { success: true, resultStatus: 'RECOVERED', recoveredAmount: transaction.amount };
        }
        return { success: true, resultStatus: 'PENDING', recoveredAmount: 0 };
      }
      case 'SEND_EMAIL': {
        await this.provider.sendEmail(customer.id, 'Your payment failed...');
        if (successOutcome) {
          return { success: true, resultStatus: 'RECOVERED', recoveredAmount: transaction.amount };
        }
        return { success: true, resultStatus: 'PENDING', recoveredAmount: 0 };
      }
      case 'ESCALATE_HUMAN': {
        return { success: true, resultStatus: 'ESCALATED', recoveredAmount: 0 };
      }
      case 'STOP': {
        return { success: true, resultStatus: 'PENDING', recoveredAmount: 0 };
      }
      default:
        return { success: false, resultStatus: 'PENDING', recoveredAmount: 0 };
    }
  }
}
