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

  it('prioritizes exact matches over amount mismatches (prevents duplicate stealing)', () => {
    const bankRecords = [
      { id: 'b1', amount: 3000, type: 'CREDIT', category: 'Salary' },
      { id: 'b2', amount: 2500, type: 'CREDIT', category: 'Salary' }
    ];
    // b1 is processed first, but it should not steal a1, because b2 is an exact match for a1
    const aisRecords = [{ id: 'a1', amount: 2500, category: 'Salary' }];
    
    const result = reconcile(bankRecords, aisRecords);
    
    expect(result.matched).toHaveLength(1);
    expect(result.matched[0].bankRecord.id).toBe('b2');
    expect(result.matched[0].aisRecord.id).toBe('a1');
    expect(result.bankOnly).toHaveLength(1);
    expect(result.bankOnly[0].id).toBe('b1');
    expect(result.mismatched).toHaveLength(0);
  });

  it('matches correctly regardless of date presence (verifies date independence)', () => {
    const bankRecords = [
      { id: 'b1', amount: 5000, type: 'CREDIT', category: 'Interest', date: '2025-05-01' }
    ];
    const aisRecords = [
      { id: 'a1', amount: 5000, category: 'Interest', date: '2025-12-31' }
    ];
    
    const result = reconcile(bankRecords, aisRecords);
    
    expect(result.matched).toHaveLength(1);
    expect(result.matched[0].bankRecord.id).toBe('b1');
    expect(result.mismatched).toHaveLength(0);
  });

  it('handles multiple exact matches of the same category and amount gracefully', () => {
    const bankRecords = [
      { id: 'b1', amount: 500, type: 'CREDIT', category: 'Dividend' },
      { id: 'b2', amount: 500, type: 'CREDIT', category: 'Dividend' }
    ];
    const aisRecords = [
      { id: 'a1', amount: 500, category: 'Dividend' },
      { id: 'a2', amount: 500, category: 'Dividend' }
    ];
    
    const result = reconcile(bankRecords, aisRecords);
    
    expect(result.matched).toHaveLength(2);
    // Both should be exactly matched deterministically (b1->a1, b2->a2)
    expect(result.matched[0].bankRecord.id).toBe('b1');
    expect(result.matched[0].aisRecord.id).toBe('a1');
    expect(result.matched[1].bankRecord.id).toBe('b2');
    expect(result.matched[1].aisRecord.id).toBe('a2');
    expect(result.mismatched).toHaveLength(0);
    expect(result.bankOnly).toHaveLength(0);
    expect(result.aisOnly).toHaveLength(0);
  });

  it('deterministically excludes DEBIT records from reconciliation', () => {
    const bankRecords = [
      { id: 'b1', amount: 5000, type: 'DEBIT', category: 'Salary' },
      { id: 'b2', amount: 3000, type: 'CREDIT', category: 'Interest' }
    ];
    const aisRecords = [
      { id: 'a1', amount: 5000, category: 'Salary' },
      { id: 'a2', amount: 3000, category: 'Interest' }
    ];
    
    const result = reconcile(bankRecords, aisRecords);
    
    // b2 matches a2. b1 is ignored. a1 becomes aisOnly.
    expect(result.matched).toHaveLength(1);
    expect(result.matched[0].bankRecord.id).toBe('b2');
    expect(result.aisOnly).toHaveLength(1);
    expect(result.aisOnly[0].id).toBe('a1');
    expect(result.bankOnly).toHaveLength(0);
    expect(result.needsReview).toHaveLength(0);
  });

  it('matches Uncategorized records textually before flagging as ambiguous', () => {
    const bankRecords = [
      { id: 'b1', description: 'MONTHLY SALARY', amount: 50000, type: 'CREDIT', category: 'Uncategorized' }
    ];
    const aisRecords = [
      { id: 'a1', amount: 50000, category: 'Salary' }
    ];
    
    const result = reconcile(bankRecords, aisRecords);
    
    // It should match textually via normalize() in isSameCategory
    expect(result.matched).toHaveLength(1);
    expect(result.matched[0].bankRecord.id).toBe('b1');
    expect(result.needsReview).toHaveLength(0);
  });

  it('prevents Uncategorized records from blindly matching each other purely based on category', () => {
    const bankRecords = [
      { id: 'b1', description: 'UNKNOWN DEPOSIT', amount: 5000, type: 'CREDIT', category: 'Uncategorized' }
    ];
    const aisRecords = [
      { id: 'a1', amount: 5000, category: 'Uncategorized' },
      { id: 'a2', amount: 6000, category: 'Uncategorized' }
    ];
    
    const result = reconcile(bankRecords, aisRecords);
    
    // They should not match (neither exact nor mismatch). Bank should go to needsReview, AIS to aisOnly.
    expect(result.matched).toHaveLength(0);
    expect(result.mismatched).toHaveLength(0);
    expect(result.needsReview).toHaveLength(1);
    expect(result.aisOnly).toHaveLength(2);
  });
});
