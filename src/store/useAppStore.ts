import { create } from 'zustand';
import type { Case, AuditLogEntry } from '../models/types';
import { generateSyntheticData } from '../services/syntheticData';
import { RecoveryOrchestrator } from '../services/recoveryOrchestrator';
import { MockPaymentProvider } from '../services/paymentProvider';
import { ActionExecutor } from '../services/actionExecutor';

const provider = new MockPaymentProvider();
const executor = new ActionExecutor(provider);
const orchestrator = new RecoveryOrchestrator(executor);

interface AppState {
  cases: Case[];
  auditLogs: AuditLogEntry[];
  isProcessing: boolean;
  initializeData: () => void;
  runBatchRecovery: () => Promise<void>;
  simulateSingleCase: (caseId: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  cases: [],
  auditLogs: [],
  isProcessing: false,
  
  initializeData: () => {
    const data = generateSyntheticData(100);
    set({ cases: data, auditLogs: [], isProcessing: false });
  },

  runBatchRecovery: async () => {
    set({ isProcessing: true });
    const { cases, auditLogs } = get();
    const pendingCases = cases.filter(c => c.status === 'PENDING');
    
    let updatedCases = [...cases];
    let newLogs = [...auditLogs];

    // Process sequentially to simulate realistic batch (can be done in parallel but sequential shows UI updates nicely if we want, or just wait for all)
    // For demo speed, let's just do Promise.all
    const promises = pendingCases.map(c => orchestrator.processCase(c));
    const results = await Promise.all(promises);

    results.forEach(({ updatedCase, logs }) => {
      const idx = updatedCases.findIndex(c => c.id === updatedCase.id);
      if (idx !== -1) updatedCases[idx] = updatedCase;
      
      const fullLogs = logs.map(l => ({
        ...l,
        id: `LOG-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toISOString()
      }));
      newLogs = [...newLogs, ...fullLogs];
    });

    set({ cases: updatedCases, auditLogs: newLogs, isProcessing: false });
  },

  simulateSingleCase: async (caseId: string) => {
    const { cases, auditLogs } = get();
    const c = cases.find(c => c.id === caseId);
    
    // Prevent duplicate execution (Idempotency fix)
    if (!c || c.status !== 'PENDING') {
      const blockLog = {
        id: `LOG-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toISOString(),
        caseId,
        transactionId: c?.transaction.id || '',
        customerId: c?.customer.id || '',
        action: 'ACTION_EXECUTED' as any,
        details: 'Duplicate action prevented (Idempotency block). Case already executed.',
        financialImpact: 0
      };
      set({ auditLogs: [...auditLogs, blockLog] });
      return;
    }

    set({ isProcessing: true });
    
    const { updatedCase, logs } = await orchestrator.processCase(c);
    
    const fullLogs = logs.map(l => ({
        ...l,
        id: `LOG-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toISOString()
    }));

    set(state => ({
      cases: state.cases.map(existing => existing.id === caseId ? updatedCase : existing),
      auditLogs: [...state.auditLogs, ...fullLogs],
      isProcessing: false
    }));
  }
}));
