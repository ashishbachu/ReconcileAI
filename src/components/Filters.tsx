

interface FiltersProps {
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  reasonFilter: string;
  setReasonFilter: (val: string) => void;
  dateFilter: string;
  setDateFilter: (val: string) => void;
  reasons: string[];
}

export default function Filters({ statusFilter, setStatusFilter, reasonFilter, setReasonFilter, dateFilter, setDateFilter, reasons }: FiltersProps) {
  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', padding: '16px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Date Range</label>
        <select 
          value={dateFilter} 
          onChange={e => setDateFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-primary)', minWidth: '150px' }}
        >
          <option value="ALL">All Time</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</label>
        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-primary)', minWidth: '150px' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="RECOVERED">Recovered</option>
          <option value="FAILED">Failed</option>
          <option value="ESCALATED">Escalated</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Failure Reason</label>
        <select 
          value={reasonFilter} 
          onChange={e => setReasonFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-primary)', minWidth: '150px' }}
        >
          <option value="ALL">All Reasons</option>
          {reasons.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
