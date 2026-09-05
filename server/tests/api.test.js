import { test, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import apiRoutes from '../src/routes/index.js';

let server;
let baseUrl;

beforeAll(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api', apiRoutes);
  
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}/api`;
      resolve();
    });
  });
});

afterAll(() => {
  server.close();
});

test('initial reconciliation status, mark as reviewed, fetch again', async () => {
  // 1. Fetch initial status
  let res = await fetch(`${baseUrl}/reconcile`);
  let data = await res.json();
  
  const initialMismatchCount = data.mismatched.length;
  expect(initialMismatchCount).toBeGreaterThan(0);
  
  const targetId = data.mismatched[0].bankRecord.id;

  // 2. Mark as reviewed
  const reviewRes = await fetch(`${baseUrl}/reconcile/${targetId}/review`, { method: 'POST' });
  const reviewData = await reviewRes.json();
  expect(reviewData.success).toBe(true);
  expect(reviewData.id).toBe(targetId);

  // 3. Fetch again and check updated status
  res = await fetch(`${baseUrl}/reconcile`);
  data = await res.json();
  
  // Mismatch count should be lower by 1
  expect(data.mismatched.length).toBe(initialMismatchCount - 1);
  
  // The reviewed item should now be in matched
  const matchedItem = data.matched.find(m => m.bankRecord.id === targetId);
  expect(matchedItem).toBeDefined();
  expect(matchedItem.isReviewed).toBe(true);
});
