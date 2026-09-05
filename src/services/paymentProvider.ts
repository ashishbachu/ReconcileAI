import type { PaymentStatus } from '../models/types';

export interface PaymentProvider {
  retryPayment(transactionId: string): Promise<PaymentStatus>;
  createPaymentLink(amount: number, customerId: string): Promise<boolean>;
  sendWhatsApp(customerId: string, message: string): Promise<boolean>;
  sendEmail(customerId: string, message: string): Promise<boolean>;
}

export class MockPaymentProvider implements PaymentProvider {
  async retryPayment(_transactionId: string): Promise<PaymentStatus> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    // 70% chance of success on retry simulation
    return Math.random() > 0.3 ? 'SUCCESS' : 'FAILED';
  }

  async createPaymentLink(_amount: number, _customerId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true; // Simulate successfully sending link
  }

  async sendWhatsApp(_customerId: string, _message: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  async sendEmail(_customerId: string, _message: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return true;
  }
}
