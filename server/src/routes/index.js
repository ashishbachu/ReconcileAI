const express = require('express');
const { reconcile } = require('../engine/reconcile');
const { explainDiscrepancy, explainAmbiguousTransaction } = require('../services/AIExplanationService');
const bankData = require('../data/bank.json');
const aisData = require('../data/ais.json');

const router = express.Router();

// Minimal in-memory state for the hackathon prototype
const reviewedIds = new Set();

router.get('/reconcile', (req, res) => {
  const result = reconcile(bankData, aisData);
  
  // Apply in-memory reviewed state
  const finalResult = {
    matched: [...result.matched],
    mismatched: [],
    needsReview: [],
    bankOnly: [...result.bankOnly],
    aisOnly: [...result.aisOnly]
  };

  result.mismatched.forEach(item => {
    if (reviewedIds.has(item.bankRecord.id)) {
      finalResult.matched.push({...item, status: 'MATCHED', isReviewed: true});
    } else {
      finalResult.mismatched.push(item);
    }
  });

  result.needsReview.forEach(item => {
    if (reviewedIds.has(item.id)) {
       finalResult.matched.push({bankRecord: item, aisRecord: null, status: 'MATCHED', isReviewed: true});
    } else {
       finalResult.needsReview.push(item);
    }
  });

  res.json(finalResult);
});

router.post('/reconcile/:id/review', (req, res) => {
  const { id } = req.params;
  reviewedIds.add(id);
  res.json({ success: true, id });
});

router.post('/explain-ambiguous', async (req, res) => {
  const { transaction } = req.body;
  if (!transaction) return res.status(400).json({ error: 'Missing transaction data' });
  
  const explanation = await explainAmbiguousTransaction(transaction);
  res.json({ explanation });
});

router.post('/explain-discrepancy', async (req, res) => {
  const { bankRecord, aisRecord } = req.body;
  if (!bankRecord || !aisRecord) return res.status(400).json({ error: 'Missing records for comparison' });
  
  const explanation = await explainDiscrepancy(bankRecord, aisRecord);
  res.json({ explanation });
});

module.exports = router;
