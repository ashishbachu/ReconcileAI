const express = require('express');
const { reconcile } = require('../engine/reconcile');
const { explainDiscrepancy, explainAmbiguousTransaction } = require('../services/AIExplanationService');
const bankData = require('../data/bank.json');
const aisData = require('../data/ais.json');

const router = express.Router();

router.get('/reconcile', (req, res) => {
  // In a real app, data comes from a DB via a service.
  const result = reconcile(bankData, aisData);
  res.json(result);
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
