import { describe, it, expect } from 'vitest';
import { reconcile } from '../src/engine/reconcile';

describe('V2 Deterministic Reconciliation Engine', () => {
  it('identifies exact matches', () => {
    const bankRecords = [{ id: 'b1', amount: 50000, type: 'CREDIT', category: 'Salary' }];
    const aisRecords = [{ id: 'a1', amount: 50000, category: 'Salary' }];
    
    const result = reconcile(bankRecords, aisRecords);
    
    expect(result.matched).toHaveLength(1);
    expect(result.matched[0].bankRecord.id).toBe('b1');
    expect(result.mismatched).toHaveLength(0);
  });

  it('identifies amount mismatches and calculates difference', () => {
    const bankRecords = [{ id: 'b1', amount: 3000, type: 'CREDIT', category: 'Interest' }];
    const aisRecords = [{ id: 'a1', amount: 2500, category: 'Interest' }];
    
    const result = reconcile(bankRecords, aisRecords);
    
    expect(result.matched).toHaveLength(0);
    expect(result.mismatched).toHaveLength(1);
    expect(result.mismatched[0].difference).toBe(500);
    expect(result.mismatched[0].reason).toBe('Amount differs');
  });

  it('identifies ambiguous transactions needing review', () => {
    const bankRecords = [{ id: 'b1', description: 'UPI TRANSFER', amount: 15000, type: 'CREDIT', category: 'Uncategorized' }];
    const aisRecords = [];
    
    const result = reconcile(bankRecords, aisRecords);
    
    expect(result.needsReview).toHaveLength(1);
    expect(result.needsReview[0].reconciliationStatus).toBe('NEEDS_REVIEW');
    expect(result.bankOnly).toHaveLength(0);
  });

  it('identifies bank-only non-ambiguous transactions', () => {
    const bankRecords = [{ id: 'b1', description: 'ITD REFUND', amount: 12000, type: 'CREDIT', category: 'Refund' }];
    const aisRecords = [];
    
    const result = reconcile(bankRecords, aisRecords);
    
    expect(result.bankOnly).toHaveLength(1);
    expect(result.needsReview).toHaveLength(0);
  });

  it('identifies ais-only records', () => {
    const bankRecords = [];
    const aisRecords = [{ id: 'a1', amount: 5000, category: 'Interest' }];
    
    const result = reconcile(bankRecords, aisRecords);
    
    expect(result.aisOnly).toHaveLength(1);
  });

  it('handles duplicates by matching first available', () => {
    const bankRecords = [
      { id: 'b1', amount: 1000, type: 'CREDIT', category: 'Dividend' },
      { id: 'b2', amount: 1000, type: 'CREDIT', category: 'Dividend' }
    ];
    const aisRecords = [{ id: 'a1', amount: 1000, category: 'Dividend' }];
    
    const result = reconcile(bankRecords, aisRecords);
    
    expect(result.matched).toHaveLength(1);
    expect(result.bankOnly).toHaveLength(1);
    expect(result.bankOnly[0].id).toBe('b2');
  });
});
