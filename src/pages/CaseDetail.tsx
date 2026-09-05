import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Play, ShieldAlert, ShieldCheck } from 'lucide-react';
import { AIDecisionEngine } from '../services/aiDecisionEngine';
import type { AIDecision } from '../models/types';

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const cases = useAppStore(state => state.cases);
  const simulateSingleCase = useAppStore(state => state.simulateSingleCase);
  const isProcessing = useAppStore(state => state.isProcessing);
  
  const caseData = cases.find(c => c.id === id);
  const [previewDecision, setPreviewDecision] = useState<AIDecision | undefined>(caseData?.aiDecision);

  useEffect(() => {
    if (caseData && caseData.status === 'PENDING' && !caseData.aiDecision) {
      AIDecisionEngine.analyzeCase(caseData).then(decision => {
        setPreviewDecision(decision);
      });
    } else {
      setPreviewDecision(caseData?.aiDecision);
    }
  }, [caseData]);

  if (!caseData) return <div>Case not found</div>;

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div>
      <div className="page-header" style={{ justifyContent: 'flex-start', gap: '24px' }}>
        <Link to="/" className="btn btn-secondary" style={{ padding: '8px' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="page-title" style={{ marginBottom: '4px' }}>Case {caseData.id}</h1>
          <div className="text-muted" style={{ fontSize: '14px' }}>
            {caseData.customer.name} • {formatCurrency(caseData.transaction.amount)}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="kpi-card">
            <h2 className="card-title">Decision Summary</h2>
            
            <div className="info-block" style={{ marginBottom: '24px' }}>
              <div className="text-muted" style={{ fontSize: '13px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Reasoning</div>
              <div style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                <strong>{previewDecision?.diagnosis}</strong>
                <br/>
                {previewDecision?.reason}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '48px', marginBottom: '24px', padding: '0 16px' }}>
              <div>
                <div className="text-muted" style={{ fontSize: '13px', marginBottom: '4px' }}>Decision</div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>{previewDecision?.recommendedAction}</div>
              </div>
              <div>
                <div className="text-muted" style={{ fontSize: '13px', marginBottom: '4px' }}>Confidence</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--success-text)' }}>
                  {((previewDecision?.confidence || 0) * 100).toFixed(0)}%
                </div>
              </div>
              <div>
                <div className="text-muted" style={{ fontSize: '13px', marginBottom: '4px' }}>Expected Recovery</div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>
                  {formatCurrency(previewDecision?.expectedRecovery || 0)}
                </div>
              </div>
            </div>

            <div style={{ padding: '0 16px' }}>
              <div className="text-muted" style={{ fontSize: '13px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Why this action?</div>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.8 }}>
                <li>Customer Lifetime Value: <span style={{fontWeight: 500, color: 'var(--text-primary)'}}>{formatCurrency(caseData.customer.lifetimeValue)}</span></li>
                <li>Previous successful payments: <span style={{fontWeight: 500, color: 'var(--text-primary)'}}>{caseData.customer.previousSuccessfulPayments}</span></li>
                <li>Retry count: <span style={{fontWeight: 500, color: 'var(--text-primary)'}}>{caseData.transaction.retryCount}</span></li>
              </ul>
            </div>
          </div>

          <div className="kpi-card">
            <h2 className="card-title">Guardrails</h2>
            {caseData.guardrailResult ? (
              <div className="info-block" style={{ background: caseData.guardrailResult.passed ? 'var(--success-bg)' : 'var(--danger-bg)', border: 'none', display: 'flex', gap: '12px', alignItems: 'center' }}>
                {caseData.guardrailResult.passed ? (
                  <><ShieldCheck color="var(--success-text)" /> <span className="text-success" style={{ fontWeight: 600 }}>Action Approved</span></>
                ) : (
                  <><ShieldAlert color="var(--danger-text)" /> <span className="text-danger" style={{ fontWeight: 600 }}>Action Blocked: {caseData.guardrailResult.reason}</span></>
                )}
              </div>
            ) : (
              <div className="info-block text-muted">Guardrails will be evaluated upon execution.</div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="kpi-card" style={{ borderTop: '4px solid var(--primary)' }}>
            <h2 className="card-title">Action Simulator</h2>
            <div style={{ marginBottom: '24px', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-muted" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Status</span>
              <span className={`badge ${caseData.status === 'PENDING' ? 'warning' : caseData.status === 'RECOVERED' ? 'success' : 'danger'}`}>
                {caseData.status}
              </span>
            </div>
            
            {caseData.status === 'PENDING' ? (
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                onClick={() => simulateSingleCase(caseData.id)}
                disabled={isProcessing}
              >
                {isProcessing ? 'Executing...' : <><Play size={16} /> Execute Recovery</>}
              </button>
            ) : (
              <div className="info-block">
                <div style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>Execution Result</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Action <strong>{caseData.finalAction}</strong> resulted in status <strong>{caseData.status}</strong>.
                </div>
                {caseData.recoveredAmount > 0 && (
                  <div style={{ marginTop: '12px', color: 'var(--success-text)', fontWeight: 700, fontSize: '16px' }}>
                    Recovered: {formatCurrency(caseData.recoveredAmount)}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="kpi-card">
            <h2 className="card-title">Customer Profile</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                <span className="text-secondary">Segment</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{caseData.customer.segment}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                <span className="text-secondary">Sub Status</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{caseData.customer.subscriptionStatus}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Failures</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{caseData.customer.previousFailedPayments}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
