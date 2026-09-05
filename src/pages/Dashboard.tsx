import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Play, ArrowRight } from 'lucide-react';
import { calculateMetrics } from '../utils/metrics';
import Filters from '../components/Filters';
import { CustomPieChart, CustomBarChart } from '../components/Charts';
import { subDays, isAfter } from 'date-fns';

export default function Dashboard() {
  const allCases = useAppStore(state => state.cases);
  const runBatchRecovery = useAppStore(state => state.runBatchRecovery);
  const isProcessing = useAppStore(state => state.isProcessing);

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
  const { revenueAtRisk, actualRecovered, caseRecoveryRate, totalCases, recoveredCases } = metrics;

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    cases.forEach(c => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [cases]);

  const funnelData = [
    { name: 'Failed Payments', value: totalCases },
    { name: 'Intervention', value: cases.filter(c => c.finalAction).length },
    { name: 'Recovered', value: recoveredCases }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <button 
          className="btn btn-primary" 
          onClick={runBatchRecovery} 
          disabled={isProcessing || revenueAtRisk === 0}
        >
          {isProcessing ? 'Processing Cases...' : <><Play size={16} /> Run Recovery Agent</>}
        </button>
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
          <div className="kpi-value text-danger">{formatCurrency(revenueAtRisk)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Actual Recovered</div>
          <div className="kpi-value text-success">{formatCurrency(actualRecovered)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Case Recovery Rate</div>
          <div className="kpi-value">{caseRecoveryRate.toFixed(1)}%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Active Cases</div>
          <div className="kpi-value">{cases.filter(c => c.status === 'PENDING').length}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
        <div className="kpi-card">
           <CustomPieChart data={statusData} title="Cases by Status" />
        </div>
        <div className="kpi-card">
           <CustomBarChart data={funnelData} title="Recovery Funnel" />
        </div>
      </div>

      <div style={{ gap: '32px' }}>
        <div>
          <h2 className="card-title">Active Recovery Cases</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>AI Action</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cases.slice(0, 10).map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{c.customer.name}</div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>{c.customer.email}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(c.transaction.amount)}</td>
                    <td>
                      <span className={`badge ${c.status === 'PENDING' ? 'warning' : c.status === 'RECOVERED' ? 'success' : 'danger'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px' }}>{c.finalAction || c.aiDecision?.recommendedAction || '-'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/case/${c.id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        View <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
