import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { calculateMetrics } from '../utils/metrics';
import Filters from '../components/Filters';
import { CustomPieChart, CustomBarChart } from '../components/Charts';
import { subDays, isAfter } from 'date-fns';

export default function Analytics() {
  const allCases = useAppStore(state => state.cases);
  
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [reasonFilter, setReasonFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');

  const uniqueReasons = useMemo(() => {
    const reasons = new Set<string>();
    allCases.forEach(c => {
      if (c.transaction.failureReason) reasons.add(c.transaction.failureReason);
    });
    return Array.from(reasons);
  }, [allCases]);

  const cases = useMemo(() => {
    const now = new Date();
    return allCases.filter(c => {
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (reasonFilter !== 'ALL' && c.transaction.failureReason !== reasonFilter) return false;
      
      if (dateFilter !== 'ALL') {
        const days = parseInt(dateFilter, 10);
        const cutoffDate = subDays(now, days);
        const caseDate = new Date(c.createdAt);
        if (!isAfter(caseDate, cutoffDate)) return false;
      }
      return true;
    });
  }, [allCases, statusFilter, reasonFilter, dateFilter]);

  const metrics = calculateMetrics(cases);
  const {
    revenueAtRisk,
    expectedRecoverable,
    actualRecovered,
    revenueRecoveryRate,
    precision,
    recall,
    fpr,
    actionAccuracy,
    aiErrors,
    actionCounts,
    guardrailBlocks,
    humanEscalations
  } = metrics;

  const actionChartData = useMemo(() => {
    return Object.entries(actionCounts).map(([name, value]) => ({ name, value }));
  }, [actionCounts]);

  const reasonChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    cases.forEach(c => {
      const reason = c.transaction.failureReason || 'Unknown';
      counts[reason] = (counts[reason] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [cases]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analytics & Evaluation</h1>
      </div>

      <Filters 
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        reasonFilter={reasonFilter} setReasonFilter={setReasonFilter}
        dateFilter={dateFilter} setDateFilter={setDateFilter}
        reasons={uniqueReasons}
      />

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Revenue at Risk</div>
          <div className="kpi-value">₹{revenueAtRisk.toLocaleString('en-IN')}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Expected Recoverable</div>
          <div className="kpi-value">₹{Math.round(expectedRecoverable).toLocaleString('en-IN')}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Actual Recovered</div>
          <div className="kpi-value text-success">
            ₹{actualRecovered.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Revenue Recovery Rate</div>
          <div className="kpi-value text-success">
            {revenueRecoveryRate.toFixed(1)}%
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
        <div className="kpi-card">
           <CustomBarChart data={actionChartData} title="Intervention Distribution" />
        </div>
        <div className="kpi-card">
           <CustomPieChart data={reasonChartData} title="Failure Reasons" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* AI DECISION QUALITY */}
        <div className="kpi-card">
          <h2 className="card-title">AI Decision Quality</h2>
          <div className="info-block" style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, border: 'none', background: 'var(--bg-main)' }}>
            <p style={{ marginBottom: '16px' }}>
              Evaluation of the AI's predictions against the synthetic ground truth scenario, irrespective of final execution outcomes.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Precision (Eligibility)</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {precision.toFixed(1)}%
                </div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Recall (Eligibility)</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {recall.toFixed(1)}%
                </div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>False-Positive Rate</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {fpr.toFixed(1)}%
                </div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Action Accuracy</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {actionAccuracy.toFixed(1)}%
                </div>
              </div>
            </div>
            
            <h3 style={{ marginTop: '24px', marginBottom: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>Evaluation Examples (AI Errors)</h3>
            {aiErrors.length === 0 ? (
               <p>No errors recorded.</p>
            ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 {aiErrors.map((err, i) => (
                   <div key={i} style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px' }}>
                     <strong>{err.id}</strong><br/>
                     <span className="text-secondary">Expected:</span> {err.optimal} | <span className="text-secondary">AI Picked:</span> {err.recommended}<br/>
                     <span className="text-secondary">AI Reasoning:</span> {err.reason}
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>

        {/* FINANCIAL OUTCOME */}
        <div className="kpi-card">
          <h2 className="card-title">Financial Outcome & Execution</h2>
          <div className="info-block" style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, border: 'none', background: 'var(--bg-main)' }}>
            <p style={{ marginBottom: '16px' }}>
              The actual recovered revenue simulated by the deterministic outcome model based on the case characteristics and the executed action.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Guardrail Blocks</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{guardrailBlocks}</div>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Human Escalations</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{humanEscalations}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
