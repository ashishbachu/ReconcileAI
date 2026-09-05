import { useAppStore } from '../store/useAppStore';
import { format } from 'date-fns';
import { ShieldCheck, ShieldAlert, Zap, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuditLog() {
  const auditLogs = useAppStore(state => state.auditLogs);

  const getIcon = (action: string, details: string) => {
    if (action === 'SYSTEM_ANALYSIS') return <Activity size={16} color="var(--primary)" />;
    if (action === 'GUARDRAIL_CHECK') {
      return details.includes('Passed') ? <ShieldCheck size={16} color="var(--success)" /> : <ShieldAlert size={16} color="var(--danger)" />;
    }
    return <Zap size={16} color="var(--warning)" />;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Audit Log</h1>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Case ID</th>
              <th>Action / Event</th>
              <th>Details</th>
              <th>Impact</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.slice().reverse().map(log => (
              <tr key={log.id}>
                <td className="text-muted" style={{ whiteSpace: 'nowrap', fontSize: '13px' }}>
                  {format(new Date(log.timestamp), 'HH:mm:ss')}
                </td>
                <td style={{ fontWeight: 600 }}>
                  <Link to={`/case/${log.caseId}`}>{log.caseId}</Link>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getIcon(log.action, log.details)}
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.action}</span>
                  </div>
                </td>
                <td style={{ maxWidth: '400px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                  {log.details}
                </td>
                <td style={{ fontWeight: 600 }}>
                  {log.financialImpact > 0 ? (
                    <span className="text-success">+₹{log.financialImpact.toLocaleString('en-IN')}</span>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
              </tr>
            ))}
            {auditLogs.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
                  No audit logs yet. Run the Recovery Agent to generate events.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
