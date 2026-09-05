export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING';
export type ActionType = 'RETRY_PAYMENT' | 'SEND_PAYMENT_LINK' | 'SEND_WHATSAPP' | 'SEND_EMAIL' | 'ESCALATE_HUMAN' | 'STOP';
export type RecoveryStatus = 'PENDING' | 'RECOVERED' | 'FAILED' | 'ESCALATED' | 'BLOCKED';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lifetimeValue: number;
  segment: string;
  previousSuccessfulPayments: number;
  previousFailedPayments: number;
  subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'PAST_DUE';
}

export interface Transaction {
  id: string;
  customerId: string;
  amount: number;
  timestamp: string;
  status: PaymentStatus;
  failureReason?: string;
  retryCount: number;
  lastPaymentDate?: string;
}

export interface AIDecision {
  diagnosis: string;
  recoveryProbability: number;
  recommendedAction: ActionType;
  confidence: number;
  expectedRecovery: number;
  reason: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  requiresHumanReview: boolean;
}

export interface GuardrailResult {
  passed: boolean;
  reason?: string;
}

export interface Case {
  id: string;
  transaction: Transaction;
  customer: Customer;
  status: RecoveryStatus;
  aiDecision?: AIDecision;
  guardrailResult?: GuardrailResult;
  finalAction?: ActionType;
  recoveredAmount: number;
  createdAt: string;
  updatedAt: string;
  // For evaluation
  groundTruth: {
    isRecoverable: boolean;
    optimalAction: ActionType;
    expectedRecoveryProbability: number;
    expectedRecoveryAmount: number;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  caseId: string;
  transactionId: string;
  customerId: string;
  action: ActionType | 'SYSTEM_ANALYSIS' | 'GUARDRAIL_CHECK' | 'ACTION_EXECUTED';
  details: string;
  aiDecision?: AIDecision;
  guardrailResult?: GuardrailResult;
  financialImpact: number;
}
