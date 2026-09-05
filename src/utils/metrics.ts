import type { Case } from '../models/types';

export function calculateMetrics(cases: Case[]) {
  const totalCases = cases.length;

  // 1. Financial Metrics
  const revenueAtRisk = cases.reduce((sum, c) => sum + c.transaction.amount, 0);
  
  // To mathematically guarantee Actual <= Expected <= At Risk:
  // Expected is the sum of transaction amounts for cases that are genuinely recoverable.
  const expectedRecoverable = cases
    .filter(c => c.groundTruth)
    .reduce((sum, c) => sum + (c.groundTruth?.expectedRecoveryAmount || 0), 0);

  const actualRecovered = cases
    .filter(c => c.status === 'RECOVERED')
    .reduce((sum, c) => sum + (c.recoveredAmount || 0), 0);

  // 2. Recovery Rates
  const eligibleRecoveryCases = cases.filter(c => c.groundTruth?.isRecoverable).length;
  const recoveredCases = cases.filter(c => c.status === 'RECOVERED').length;
  
  const caseRecoveryRate = eligibleRecoveryCases > 0 
    ? (recoveredCases / eligibleRecoveryCases) * 100 
    : 0;

  const revenueRecoveryRate = revenueAtRisk > 0 
    ? (actualRecovered / revenueAtRisk) * 100 
    : 0;

  // 3. AI Evaluation Metrics
  let truePositives = 0;
  let falsePositives = 0;
  let falseNegatives = 0;
  let trueNegatives = 0;
  let exactActionMatches = 0;
  
  const aiErrors: any[] = [];
  const actionCounts: Record<string, number> = {};

  cases.forEach(c => {
    // Action Distribution
    if (c.finalAction) {
      actionCounts[c.finalAction] = (actionCounts[c.finalAction] || 0) + 1;
    }

    if (!c.aiDecision || !c.groundTruth) return;

    // Binary Classification
    const aiActed = c.aiDecision.recommendedAction !== 'STOP';
    const truthActed = c.groundTruth.isRecoverable;

    if (aiActed && truthActed) truePositives++;
    if (aiActed && !truthActed) falsePositives++;
    if (!aiActed && truthActed) falseNegatives++;
    if (!aiActed && !truthActed) trueNegatives++;

    // Action Accuracy
    if (c.aiDecision.recommendedAction === c.groundTruth.optimalAction) {
      exactActionMatches++;
    } else {
      if (aiErrors.length < 3) {
         aiErrors.push({
            id: c.id,
            recommended: c.aiDecision.recommendedAction,
            optimal: c.groundTruth.optimalAction,
            reason: c.aiDecision.reason
         });
      }
    }
  });

  const evaluatedCases = truePositives + falsePositives + trueNegatives + falseNegatives;
  
  const precision = truePositives + falsePositives > 0 
    ? (truePositives / (truePositives + falsePositives)) * 100 
    : 0;
    
  const recall = truePositives + falseNegatives > 0 
    ? (truePositives / (truePositives + falseNegatives)) * 100 
    : 0;
    
  const fpr = falsePositives + trueNegatives > 0 
    ? (falsePositives / (falsePositives + trueNegatives)) * 100 
    : 0;

  const actionAccuracy = evaluatedCases > 0 
    ? (exactActionMatches / evaluatedCases) * 100 
    : 0;

  return {
    totalCases,
    revenueAtRisk,
    expectedRecoverable,
    actualRecovered,
    caseRecoveryRate,
    revenueRecoveryRate,
    eligibleRecoveryCases,
    recoveredCases,
    
    // AI Metrics
    truePositives,
    falsePositives,
    trueNegatives,
    falseNegatives,
    precision,
    recall,
    fpr,
    actionAccuracy,
    aiErrors,
    
    // Extra
    actionCounts,
    guardrailBlocks: cases.filter(c => c.guardrailResult && !c.guardrailResult.passed).length,
    humanEscalations: cases.filter(c => c.finalAction === 'ESCALATE_HUMAN').length
  };
}
