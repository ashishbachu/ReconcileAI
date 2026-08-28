/**
 * Deterministic Reconciliation Engine (V2)
 *
 * This engine deterministically maps Bank Transactions against Tax Records (AIS/TIS).
 * It identifies exact matches, amount mismatches, unmapped records, and ambiguous items.
 * 
 * Rules:
 * 1. Categorization is done textually or via explicit 'category' attributes.
 * 2. Amount differences within 0 variance are EXACT MATCHES.
 * 3. Amount differences > 0 variance are MISMATCHES.
 * 4. Unmatched Bank records that have clear categories (e.g. Refund) are BANK_ONLY.
 * 5. Unmatched Bank records with ambiguous descriptions (UPI, NEFT) are NEEDS_REVIEW.
 * 6. Unmatched Tax records are AIS_ONLY.
 */

function normalize(str) {
  if (!str) return "";
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isSameCategory(bank, ais) {
  if (bank.category && ais.category && bank.category === ais.category) {
    return true;
  }
  
  const normBankDesc = normalize(bank.description);
  const normAisCat = normalize(ais.category);
  
  if (normAisCat.includes("salary") && normBankDesc.includes("salary")) return true;
  if (normAisCat.includes("dividend") && normBankDesc.includes("dividend")) return true;
  if (normAisCat.includes("interest") && normBankDesc.includes("int")) return true;

  return false;
}

function reconcile(bankRecords, aisRecords) {
  const result = {
    matched: [],
    mismatched: [],
    bankOnly: [],
    aisOnly: [],
    needsReview: []
  };

  const matchedBankIds = new Set();
  const matchedAisIds = new Set();

  // Phase 1: Match Bank vs AIS
  for (const bank of bankRecords) {
    if (bank.type !== "CREDIT") continue; // Focus on income/credits for now

    let bestMatch = null;
    let isExactAmount = false;

    for (const ais of aisRecords) {
      if (matchedAisIds.has(ais.id)) continue;

      if (isSameCategory(bank, ais)) {
        bestMatch = ais;
        if (bank.amount === ais.amount) {
          isExactAmount = true;
          break; // Stop at first perfect match
        }
      }
    }

    if (bestMatch) {
      const difference = Math.abs(bank.amount - bestMatch.amount);
      if (isExactAmount) {
        result.matched.push({ 
          bankRecord: bank, 
          aisRecord: bestMatch, 
          status: 'MATCHED' 
        });
      } else {
        result.mismatched.push({ 
          bankRecord: bank, 
          aisRecord: bestMatch, 
          difference,
          reason: 'Amount differs',
          status: 'MISMATCH' 
        });
      }
      matchedBankIds.add(bank.id);
      matchedAisIds.add(bestMatch.id);
    }
  }

  // Phase 2: Identify Bank-Only and Ambiguous
  for (const bank of bankRecords) {
    if (matchedBankIds.has(bank.id)) continue;

    const normDesc = normalize(bank.description);
    const isAmbiguous = bank.category === 'Uncategorized' || 
                        normDesc.includes("upi") || 
                        normDesc.includes("neft");

    if (isAmbiguous) {
      result.needsReview.push({
        ...bank,
        reconciliationStatus: 'NEEDS_REVIEW',
        reason: 'Nature of transaction unclear'
      });
    } else {
      result.bankOnly.push({
        ...bank,
        reconciliationStatus: 'BANK_ONLY'
      });
    }
  }

  // Phase 3: Identify AIS-Only
  for (const ais of aisRecords) {
    if (!matchedAisIds.has(ais.id)) {
      result.aisOnly.push({
        ...ais,
        reconciliationStatus: 'AIS_ONLY'
      });
    }
  }

  return result;
}

module.exports = { reconcile };
