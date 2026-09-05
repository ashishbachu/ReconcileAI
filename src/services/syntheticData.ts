import type { Customer, Transaction, Case, PaymentStatus } from '../models/types';
// A simple ID generator to avoid an extra dependency if preferred, but let's just use Math.random

// A simple ID generator to avoid an extra dependency if preferred, but let's just use Math.random
const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

const customerNames = [
  'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Neha Gupta', 'Vikram Singh',
  'Anjali Desai', 'Suresh Rao', 'Kavita Iyer', 'Manoj Menon', 'Pooja Reddy',
  'Rajesh Nair', 'Meera Joshi', 'Sanjay Verma', 'Ritu Bhatia', 'Deepak Chopra',
  'Aarti Tiwari', 'Nitin Jain', 'Swati Agarwal', 'Karan Khanna', 'Shikha Mishra'
];

const segments = ['PREMIUM', 'STANDARD', 'NEW', 'AT_RISK'];
const failureReasons = [
  'INSUFFICIENT_FUNDS',
  'CARD_DECLINED',
  'BANK_TIMEOUT',
  'DO_NOT_HONOR',
  'EXCEED_LIMIT',
  'INVALID_CARD',
  'NETWORK_ERROR'
];

export const generateSyntheticData = (count: number = 100): Case[] => {
  const cases: Case[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const isSuccess = Math.random() > 0.8; // 80% failure for this risk dataset
    const status: PaymentStatus = isSuccess ? 'SUCCESS' : 'FAILED';
    const amount = Math.floor(Math.random() * 9500) + 500; // 500 to 10000

    const customer: Customer = {
      id: generateId('CUS'),
      name: customerNames[Math.floor(Math.random() * customerNames.length)],
      email: `customer${i}@example.com`,
      phone: `+9198${Math.floor(10000000 + Math.random() * 90000000)}`,
      lifetimeValue: Math.floor(Math.random() * 100000) + 5000,
      segment: segments[Math.floor(Math.random() * segments.length)],
      previousSuccessfulPayments: Math.floor(Math.random() * 20),
      previousFailedPayments: Math.floor(Math.random() * 5),
      subscriptionStatus: Math.random() > 0.2 ? 'ACTIVE' : (Math.random() > 0.5 ? 'PAST_DUE' : 'INACTIVE'),
    };

    const transaction: Transaction = {
      id: generateId('TXN'),
      customerId: customer.id,
      amount,
      timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status,
      failureReason: isSuccess ? undefined : failureReasons[Math.floor(Math.random() * failureReasons.length)],
      retryCount: Math.floor(Math.random() * 4),
      lastPaymentDate: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    let optimalAction: import('../models/types').ActionType = 'STOP';
    let isRecoverable = false;
    let expectedRecoveryProbability = 0;
    
    if (!isSuccess) {
      if (transaction.failureReason === 'INSUFFICIENT_FUNDS') {
        optimalAction = customer.previousSuccessfulPayments > 5 ? 'SEND_PAYMENT_LINK' : 'SEND_WHATSAPP';
        isRecoverable = true;
        expectedRecoveryProbability = customer.segment === 'PREMIUM' ? 0.8 : 0.6;
      } else if (transaction.failureReason === 'BANK_TIMEOUT' || transaction.failureReason === 'NETWORK_ERROR') {
        optimalAction = 'RETRY_PAYMENT';
        isRecoverable = true;
        expectedRecoveryProbability = 0.9;
      } else if (transaction.failureReason === 'CARD_DECLINED' || transaction.failureReason === 'DO_NOT_HONOR') {
        optimalAction = amount > 5000 ? 'ESCALATE_HUMAN' : 'SEND_EMAIL';
        isRecoverable = amount <= 5000;
        expectedRecoveryProbability = isRecoverable ? 0.3 : 0.0;
      } else if (transaction.failureReason === 'EXCEED_LIMIT') {
        optimalAction = 'SEND_PAYMENT_LINK';
        isRecoverable = true;
        expectedRecoveryProbability = 0.5;
      } else {
        optimalAction = 'SEND_WHATSAPP';
        isRecoverable = true;
        expectedRecoveryProbability = 0.4;
      }
      
      if (transaction.retryCount >= 3 && optimalAction === 'RETRY_PAYMENT') {
         optimalAction = 'ESCALATE_HUMAN';
         isRecoverable = false;
         expectedRecoveryProbability = 0;
      }
      if (customer.segment === 'CHURNING') {
          expectedRecoveryProbability *= 0.2;
      }
    }

    const expectedRecoveryAmount = isRecoverable ? amount : 0;

    cases.push({
      id: generateId('CASE'),
      transaction,
      customer,
      status: isSuccess ? 'RECOVERED' : 'PENDING',
      recoveredAmount: isSuccess ? amount : 0,
      createdAt: transaction.timestamp,
      updatedAt: transaction.timestamp,
      groundTruth: {
        isRecoverable,
        optimalAction,
        expectedRecoveryProbability,
        expectedRecoveryAmount
      }
    });
  }

  return cases;
};
