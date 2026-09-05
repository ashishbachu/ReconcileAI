import type { Case, AuditLogEntry, GuardrailResult } from '../models/types';
import { AIDecisionEngine } from './aiDecisionEngine';
import { PolicyEngine } from './policyEngine';
import { ActionExecutor } from './actionExecutor';

export class RecoveryOrchestrator {
  private executor: ActionExecutor;

  constructor(executor: ActionExecutor) {
    this.executor = executor;
  }

  // Returns updated case and the new audit logs
  async processCase(c: Case): Promise<{ updatedCase: Case, logs: Omit<AuditLogEntry, 'id' | 'timestamp'>[] }> {
    const logs: Omit<AuditLogEntry, 'id' | 'timestamp'>[] = [];

    // 1. Diagnose & Decide (AI)
    const aiDecision = await AIDecisionEngine.analyzeCase(c);
    logs.push({
      caseId: c.id,
      transactionId: c.transaction.id,
      customerId: c.customer.id,
      action: 'SYSTEM_ANALYSIS',
      details: `AI Diagnosis: ${aiDecision.diagnosis} -> Recommended: ${aiDecision.recommendedAction}`,
      aiDecision,
      financialImpact: 0,
    });

    let finalAction = aiDecision.recommendedAction;
    let guardrailResult: GuardrailResult | undefined = undefined;

    // 2. Policy Engine (Guardrails)
    if (finalAction !== 'STOP') {
      guardrailResult = PolicyEngine.evaluate(c, aiDecision);
      logs.push({
        caseId: c.id,
        transactionId: c.transaction.id,
        customerId: c.customer.id,
        action: 'GUARDRAIL_CHECK',
        details: guardrailResult.passed ? 'Guardrails Passed' : `Guardrail Blocked: ${guardrailResult.reason}`,
        guardrailResult,
        financialImpact: 0,
      });

      if (!guardrailResult.passed) {
        finalAction = 'ESCALATE_HUMAN'; // safe fallback
      }
    }

    // 3. Act
    const result = await this.executor.execute(c, finalAction);
    
    // 4. Verify & Log
    logs.push({
      caseId: c.id,
      transactionId: c.transaction.id,
      customerId: c.customer.id,
      action: 'ACTION_EXECUTED',
      details: `Executed ${finalAction}. Result: ${result.resultStatus}`,
      financialImpact: result.recoveredAmount,
    });

    const updatedCase: Case = {
      ...c,
      status: result.resultStatus,
      aiDecision,
      guardrailResult,
      finalAction,
      recoveredAmount: c.recoveredAmount + result.recoveredAmount,
      updatedAt: new Date().toISOString(),
    };

    return { updatedCase, logs };
  }
}
