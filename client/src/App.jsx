import { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, useNavigate, useParams, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  ShieldCheck, CheckCircle, AlertCircle, ArrowRight, 
  LayoutDashboard, List, Database, PieChart, Calculator,
  FileText, CheckSquare, Settings, Download, 
  User, Sparkles, Building, Landmark, ChevronRight, AlertTriangle, Scale,
  Sun, Moon
} from 'lucide-react';

const BASE_API = 'http://localhost:3000/api';

const AuthContext = createContext(null);

function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <button className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }} onClick={toggle} title="Toggle Theme">
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}

// --- LAYOUTS ---
function AppLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="flex items-center gap-2">
            <Scale size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>ReconcileAI</h2>
          </div>
          <ThemeToggle />
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          <div className="text-muted text-sm font-semibold uppercase mb-2 mt-4" style={{ letterSpacing: '0.5px' }}>Overview</div>
          <Link to="/app" className={`nav-link ${isActive('/app')}`}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/app/profile" className={`nav-link ${isActive('/app/profile')}`}>
            <CheckSquare size={18} /> Tax Checklist
          </Link>
          
          <div className="text-muted text-sm font-semibold uppercase mb-2 mt-6" style={{ letterSpacing: '0.5px' }}>Data & Recon</div>
          <Link to="/app/data-sources" className={`nav-link ${isActive('/app/data-sources')}`}>
            <Database size={18} /> Data Sources
          </Link>
          <Link to="/app/transactions" className={`nav-link ${isActive('/app/transactions')}`}>
            <List size={18} /> Reconciliation Explorer
          </Link>
          <Link to="/app/documents" className={`nav-link ${isActive('/app/documents')}`}>
            <FileText size={18} /> Documents
          </Link>

          <div className="text-muted text-sm font-semibold uppercase mb-2 mt-6" style={{ letterSpacing: '0.5px' }}>Filing</div>
          <Link to="/app/income" className={`nav-link ${isActive('/app/income')}`}>
            <PieChart size={18} /> Income
          </Link>
          <Link to="/app/tax-computation" className={`nav-link ${isActive('/app/tax-computation')}`}>
            <Calculator size={18} /> Tax Computation
          </Link>
        </nav>
        
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} className="text-muted" />
            </div>
            <div>
              <div className="font-medium text-sm">{user?.name || 'User'}</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>FY 2025–26</div>
            </div>
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={logout}>
            <Settings size={16} /> Exit Workspace
          </button>
        </div>
      </aside>
      <main className="main-content">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

// --- PAGES ---

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="public-layout">
      <header className="flex justify-between items-center" style={{ padding: '1.5rem 4rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div className="flex items-center gap-2">
          <Scale size={24} color="var(--primary)" />
          <h2 style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>ReconcileAI</h2>
        </div>
        <ThemeToggle />
      </header>
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', letterSpacing: '-0.04em', maxWidth: '800px', lineHeight: 1.1, marginBottom: '1.5rem' }}>
          Reconcile before you file.
        </h1>
        <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px', marginBottom: '3rem' }}>
          Bring your financial information together, find discrepancies, and understand what needs your attention before filing your taxes.
        </p>
        <div className="flex gap-4 mb-12">
          <button className="btn btn-primary" onClick={() => navigate('/signup')}>
            Try Now <ArrowRight size={16} />
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/signin')}>Sign in</button>
        </div>

        {/* Realistic Dashboard Preview */}
        <div className="card" style={{ maxWidth: '900px', width: '100%', textAlign: 'left', padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-main)' }}>
            <h3 className="mb-2">Reconciliation Overview</h3>
            <div className="grid-4 mt-4">
              <div>
                <div className="text-muted text-sm font-medium mb-1">Records analyzed</div>
                <div className="metric-value">9</div>
              </div>
              <div>
                <div className="text-muted text-sm font-medium mb-1">Matched</div>
                <div className="metric-value" style={{ color: 'var(--success)' }}>4</div>
              </div>
              <div>
                <div className="text-muted text-sm font-medium mb-1">Needs review</div>
                <div className="metric-value" style={{ color: 'var(--warning)' }}>2</div>
              </div>
              <div>
                <div className="text-muted text-sm font-medium mb-1">Mismatches</div>
                <div className="metric-value" style={{ color: 'var(--danger)' }}>1</div>
              </div>
            </div>
          </div>
          <div style={{ padding: '2rem' }}>
            <h4 className="text-muted uppercase text-sm mb-4">Priority Actions</h4>
            <div className="task-item" style={{ borderLeft: '3px solid var(--danger)' }}>
              <div className="flex items-center gap-3">
                <AlertTriangle size={18} color="var(--danger)" />
                <div>
                  <div className="font-medium">Interest income mismatch</div>
                  <div className="text-muted text-sm">₹4,000 difference detected between Bank and AIS</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--accent)' }}>
                Review now <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="text-muted text-sm mt-12 flex items-center gap-2 justify-center">
          <ShieldCheck size={16} />
          Independent hackathon prototype. Uses synthetic data. Not affiliated with the Income Tax Department.
        </div>
      </main>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_API}/reconcile`).then(res => res.json()).then(setData);
  }, []);

  if (!data) return <AppLayout><div className="text-muted">Analyzing records...</div></AppLayout>;

  const totalRecords = data.matched.length + data.mismatched.length + data.needsReview.length + data.bankOnly.length + data.aisOnly.length;
  const actionRequired = data.mismatched.length + data.needsReview.length;

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  return (
    <AppLayout>
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="mb-2">Good morning, {firstName}.</h1>
          <p className="text-muted">FY 2025–26 • Preparation progress: 72%</p>
        </div>
      </header>

      <div className="grid-4 mb-8">
        <div className="card">
          <div className="text-muted text-sm font-medium mb-1">Records analyzed</div>
          <div className="metric-value">{totalRecords}</div>
        </div>
        <div className="card">
          <div className="text-muted text-sm font-medium mb-1">Matched</div>
          <div className="metric-value text-success">{data.matched.length}</div>
        </div>
        <div className="card">
          <div className="text-muted text-sm font-medium mb-1">Needs review</div>
          <div className="metric-value" style={{ color: 'var(--warning)' }}>{data.needsReview.length}</div>
        </div>
        <div className="card">
          <div className="text-muted text-sm font-medium mb-1">Mismatches</div>
          <div className="metric-value" style={{ color: 'var(--danger)' }}>{data.mismatched.length}</div>
        </div>
      </div>

      <div>
        <h2 className="mb-4">What needs your attention?</h2>
        {actionRequired === 0 ? (
          <div className="card flex items-center gap-3">
            <CheckCircle color="var(--success)" /> 
            <span className="font-medium">You are Tax-Ready! No discrepancies found.</span>
          </div>
        ) : (
          <div>
            <h4 className="text-muted text-sm uppercase mb-3 mt-6">High Priority</h4>
            {data.mismatched.map(m => (
              <div key={m.bankRecord.id} className="task-item" style={{ borderLeft: '3px solid var(--danger)', cursor: 'pointer' }} onClick={() => navigate(`/app/reconciliation/${m.bankRecord.id}?type=mismatch`)}>
                <div className="flex items-center gap-3">
                  <AlertTriangle size={18} color="var(--danger)" />
                  <div>
                    <div className="font-medium">{m.bankRecord.category} mismatch</div>
                    <div className="text-muted text-sm">₹{m.difference.toLocaleString()} difference</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--accent)' }}>
                  Review now <ArrowRight size={16} />
                </div>
              </div>
            ))}

            <h4 className="text-muted text-sm uppercase mb-3 mt-6">Medium</h4>
            {data.needsReview.map(r => (
              <div key={r.id} className="task-item" style={{ borderLeft: '3px solid var(--warning)', cursor: 'pointer' }} onClick={() => navigate(`/app/reconciliation/${r.id}?type=ambiguous`)}>
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} color="var(--warning)" />
                  <div>
                    <div className="font-medium">{r.description}</div>
                    <div className="text-muted text-sm">Transaction nature unclear</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--accent)' }}>
                  Review <ArrowRight size={16} />
                </div>
              </div>
            ))}

            <h4 className="text-muted text-sm uppercase mb-3 mt-6">Completed</h4>
            {data.matched.filter(m => m.isReviewed).map(m => (
              <div key={m.bankRecord.id} className="task-item" style={{ background: 'var(--bg-main)' }}>
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} color="var(--success)" />
                  <div className="text-muted font-medium">{m.bankRecord.category} reviewed and reconciled</div>
                </div>
              </div>
            ))}
            <div className="task-item" style={{ background: 'var(--bg-main)' }}>
              <div className="flex items-center gap-3">
                <CheckCircle size={18} color="var(--success)" />
                <div className="text-muted font-medium">Auto-matched records ({data.matched.filter(m => !m.isReviewed).length})</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 pt-8 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="text-muted text-sm font-medium">
          {actionRequired > 0 ? "Resolve priority actions to unlock tax computation." : "All records reconciled. You're ready."}
        </div>
        <button 
          className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}
          disabled={actionRequired > 0}
          onClick={() => navigate('/app/tax-computation')}
        >
          Proceed to Tax Computation <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
        </button>
      </div>
    </AppLayout>
  );
}

function ProfileChecklist() {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <button className="btn btn-secondary text-sm mb-6" style={{ padding: '0.375rem 0.75rem' }} onClick={() => navigate('/app')}>
        ← Back to Dashboard
      </button>
      <div className="mb-8">
        <h1 className="mb-2">Your tax filing checklist</h1>
        <p className="text-muted">72% complete</p>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }} className="flex items-center gap-4">
          <CheckCircle color="var(--success)" size={20} />
          <span className="font-medium">Connect financial data</span>
        </div>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }} className="flex items-center gap-4">
          <CheckCircle color="var(--success)" size={20} />
          <span className="font-medium">Review salary</span>
        </div>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }} className="flex items-center gap-4">
          <CheckCircle color="var(--success)" size={20} />
          <span className="font-medium">Review dividends</span>
        </div>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--danger-bg)' }} className="flex items-center gap-4">
          <AlertTriangle color="var(--danger)" size={20} />
          <span className="font-medium">Review interest mismatch</span>
        </div>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--warning-bg)' }} className="flex items-center gap-4">
          <AlertCircle color="var(--warning)" size={20} />
          <span className="font-medium">Review ambiguous transaction</span>
        </div>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }} className="flex items-center gap-4 text-muted">
          <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--text-muted)' }} />
          <span className="font-medium">Review deductions</span>
        </div>
        <div style={{ padding: '1.5rem' }} className="flex items-center gap-4 text-muted">
          <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--text-muted)' }} />
          <span className="font-medium">Final tax computation</span>
        </div>
      </div>
    </AppLayout>
  );
}

function DataSources() {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <button className="btn btn-secondary text-sm mb-6" style={{ padding: '0.375rem 0.75rem' }} onClick={() => navigate('/app')}>
        ← Back to Dashboard
      </button>
      <div className="mb-8">
        <h1 className="mb-2">Data Sources</h1>
        <p className="text-muted">Manage your connected financial and tax records.</p>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Landmark size={20} className="text-muted" />
              <h3 className="font-medium">HDFC Bank Statement</h3>
            </div>
            <span className="badge badge-success"><CheckCircle size={12}/> Demo Connected</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-muted text-sm mb-1">Updated just now</p>
              <p className="font-medium text-sm">8 records</p>
            </div>
            <span className="text-sm font-medium text-accent flex items-center cursor-pointer" onClick={() => navigate('/app/transactions')}>View records <ChevronRight size={16}/></span>
          </div>
        </div>
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Building size={20} className="text-muted" />
              <h3 className="font-medium">AIS (Income Tax Dept)</h3>
            </div>
            <span className="badge badge-success"><CheckCircle size={12}/> Demo Connected</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-muted text-sm mb-1">Updated just now</p>
              <p className="font-medium text-sm">6 records</p>
            </div>
            <span className="text-sm font-medium text-accent flex items-center cursor-pointer" onClick={() => navigate('/app/transactions')}>View records <ChevronRight size={16}/></span>
          </div>
        </div>
        <div className="card" style={{ borderStyle: 'dashed', background: 'var(--bg-main)' }}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <PieChart size={20} className="text-muted" />
              <h3 className="font-medium text-muted">Brokerage (Zerodha)</h3>
            </div>
            <span className="badge badge-neutral">Coming Soon</span>
          </div>
          <p className="text-muted text-sm mb-4">Connect to import Capital Gains</p>
          <button className="btn btn-secondary w-full text-sm py-1.5" disabled>Integration pending</button>
        </div>
      </div>

      <div className="mt-12 pt-8 text-right" style={{ borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }} onClick={() => navigate('/app')}>
          Run Reconciliation Engine <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
        </button>
      </div>
    </AppLayout>
  );
}

function TransactionExplorer() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_API}/reconcile`).then(res => res.json()).then(setData);
  }, []);

  if (!data) return <AppLayout><div className="text-muted">Loading transactions...</div></AppLayout>;
  
  const allBankRecords = [
    ...data.matched.map(m => ({ ...m.bankRecord, status: 'MATCHED' })),
    ...data.mismatched.map(m => ({ ...m.bankRecord, status: 'MISMATCH' })),
    ...data.needsReview.map(r => ({ ...r, status: 'NEEDS_REVIEW' })),
    ...data.bankOnly.map(b => ({ ...b, status: 'BANK_ONLY' }))
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <AppLayout>
      <button className="btn btn-secondary text-sm mb-6" style={{ padding: '0.375rem 0.75rem' }} onClick={() => navigate('/app')}>
        ← Back to Dashboard
      </button>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="mb-1">Reconciliation Explorer</h1>
          <p className="text-muted">Review all records and their reconciliation status.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary text-sm">All</button>
          <button className="btn btn-secondary text-sm">Needs Review</button>
          <button className="btn btn-secondary text-sm">Mismatch</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>DATE</th>
              <th>DESCRIPTION</th>
              <th>CATEGORY</th>
              <th style={{ textAlign: 'right' }}>AMOUNT</th>
              <th>RECONCILIATION STATUS</th>
            </tr>
          </thead>
          <tbody>
            {allBankRecords.map(tr => (
              <tr key={tr.id} style={{ cursor: 'pointer' }}>
                <td className="text-muted">{tr.date}</td>
                <td className="font-medium">{tr.description}</td>
                <td className="text-muted">{tr.category}</td>
                <td style={{ textAlign: 'right', fontWeight: 500 }}>
                  {tr.type === 'CREDIT' ? '+' : '-'} ₹{tr.amount.toLocaleString()}
                </td>
                <td>
                  {tr.status === 'MATCHED' && <span className="badge badge-success"><CheckCircle size={12}/> Matched</span>}
                  {tr.status === 'MISMATCH' && <span className="badge badge-danger"><AlertTriangle size={12}/> Mismatch</span>}
                  {tr.status === 'NEEDS_REVIEW' && <span className="badge badge-warning"><AlertCircle size={12}/> Needs Review</span>}
                  {tr.status === 'BANK_ONLY' && <span className="badge badge-neutral">Bank Only</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}

function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const type = new URLSearchParams(window.location.search).get('type');
  
  const [record, setRecord] = useState(null);
  const [aiText, setAiText] = useState('Analyzing discrepancy using AI...');
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    fetch(`${BASE_API}/reconcile`).then(r => r.json()).then(async data => {
      if (type === 'mismatch') {
        const item = data.mismatched.find(m => m.bankRecord.id === id);
        const matchedItem = data.matched.find(m => m.bankRecord.id === id);
        
        if (matchedItem && matchedItem.isReviewed) {
          setResolved(true);
          return;
        }
        if (!item) {
          setRecord('NOT_FOUND');
          return;
        }
        
        setRecord(item);
        try {
          const aiRes = await fetch(`${BASE_API}/explain-discrepancy`, {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ bankRecord: item.bankRecord, aisRecord: item.aisRecord })
          });
          const aiData = await aiRes.json();
          setAiText(aiData.explanation || 'Explanation unavailable.');
        } catch {
          setAiText('AI service currently unavailable.');
        }
      } else {
        const item = data.needsReview.find(r => r.id === id);
        const matchedItem = data.matched.find(m => m.bankRecord.id === id);

        if (matchedItem && matchedItem.isReviewed) {
          setResolved(true);
          return;
        }
        if (!item) {
          setRecord('NOT_FOUND');
          return;
        }

        setRecord({ bankRecord: item });
        try {
          const aiRes = await fetch(`${BASE_API}/explain-ambiguous`, {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ transaction: item })
          });
          const aiData = await aiRes.json();
          setAiText(aiData.explanation || 'Explanation unavailable.');
        } catch {
          setAiText('AI service currently unavailable.');
        }
      }
    }).catch(err => {
      console.error(err);
      setRecord('NOT_FOUND');
    });
  }, [id, type]);

  if (record === 'NOT_FOUND') return <AppLayout><div className="card mt-8 p-8 text-center text-muted">Record not found or already reviewed.</div></AppLayout>;

  if (!record) return <AppLayout><div className="text-muted">Loading record...</div></AppLayout>;

  if (resolved) {
    return (
      <AppLayout>
        <div className="card text-center" style={{ maxWidth: '400px', margin: '4rem auto' }}>
          <CheckCircle size={48} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 className="mb-2">Transaction Reviewed</h2>
          <p className="text-muted mb-6">The reconciliation status has been updated successfully.</p>
          <button className="btn btn-primary w-full" onClick={() => navigate('/app')}>Back to Dashboard to continue →</button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <button className="btn btn-secondary text-sm mb-6" style={{ padding: '0.375rem 0.75rem' }} onClick={() => navigate('/app')}>
          ← Back to Dashboard
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <h1>{type === 'mismatch' ? 'Interest Income' : 'Transaction'}</h1>
          <span className={`badge ${type === 'mismatch' ? 'badge-danger' : 'badge-warning'}`}>
            {type === 'mismatch' ? <><AlertTriangle size={12}/> Mismatch</> : <><AlertCircle size={12}/> Needs Review</>}
          </span>
        </div>
      </div>

      {type === 'mismatch' ? (
        <div className="card mb-8">
          <div className="grid-2">
            <div>
              <div className="text-muted text-sm font-medium uppercase mb-2">Bank Record</div>
              <div className="metric-value mb-1">₹{record.bankRecord.amount.toLocaleString()}</div>
              <div className="text-muted text-sm">{record.bankRecord.description}</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
              <div className="text-muted text-sm font-medium uppercase mb-2">AIS Record</div>
              <div className="metric-value mb-1">₹{record.aisRecord.amount.toLocaleString()}</div>
              <div className="text-muted text-sm">{record.aisRecord.description}</div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="text-muted text-sm font-medium uppercase mb-1">Difference</div>
            <div className="metric-value" style={{ color: 'var(--danger)' }}>₹{record.difference.toLocaleString()}</div>
          </div>
        </div>
      ) : (
        <div className="card mb-8">
          <div className="text-muted text-sm font-medium uppercase mb-2">Bank Record</div>
          <div className="metric-value mb-1">₹{record.bankRecord.amount.toLocaleString()}</div>
          <div className="text-muted text-sm">{record.bankRecord.description}</div>
        </div>
      )}

      <div className="ai-card mb-8">
        <div className="ai-card-header">
          <Sparkles size={14} /> AI-Assisted Insight
        </div>
        <p className="font-medium mb-2">{aiText}</p>
        <p className="text-muted text-sm">Verify important information against source documents before filing.</p>
      </div>

      <div className="card">
        <h3 className="mb-4">What should you do?</h3>
        {type === 'mismatch' ? (
          <div className="flex gap-3">
            <button className="btn btn-secondary" onClick={() => navigate('/app/documents')}>Review supporting document</button>
            <button className="btn btn-primary" onClick={async () => {
              await fetch(`${BASE_API}/reconcile/${id}/review`, { method: 'POST' });
              setResolved(true);
            }}>Mark as reviewed</button>
          </div>
        ) : (
          <div className="flex gap-3 flex-wrap">
            <button className="btn btn-secondary" onClick={async () => {
              await fetch(`${BASE_API}/reconcile/${id}/review`, { method: 'POST' });
              setResolved(true);
            }}>Personal Transfer</button>
            <button className="btn btn-primary" onClick={async () => {
              await fetch(`${BASE_API}/reconcile/${id}/review`, { method: 'POST' });
              setResolved(true);
            }}>Income</button>
            <button className="btn btn-secondary" onClick={async () => {
              await fetch(`${BASE_API}/reconcile/${id}/review`, { method: 'POST' });
              setResolved(true);
            }}>Refund</button>
            <button className="btn btn-secondary" onClick={async () => {
              await fetch(`${BASE_API}/reconcile/${id}/review`, { method: 'POST' });
              setResolved(true);
            }}>Other</button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// ... DocumentCenter, IncomeOverview, TaxComputation, ReconciliationList (omitted from strict rewrite for brevity, but they'd follow the exact same clean card pattern. Since this is a single file, I'll stub the remaining to ensure no breakage, just styled simply).



function DocumentCenter() {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <button className="btn btn-secondary text-sm mb-6" style={{ padding: '0.375rem 0.75rem' }} onClick={() => navigate('/app')}>
        ← Back to Dashboard
      </button>
      <h1 className="mb-2">Your documents</h1>
      <p className="text-muted mb-8">Secure digital vault for your tax documents.</p>
      <div className="grid-2">
        <div className="card flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileText size={24} className="text-muted" />
            <div>
              <div className="font-medium">Form 16 (ABC Tech)</div>
              <div className="text-muted text-sm">PDF • FY 25-26 • Processed ✓</div>
            </div>
          </div>
          <button className="btn btn-secondary text-sm" onClick={() => alert('Demo: Document downloaded.')}><Download size={14} /></button>
        </div>
        <div className="card flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileText size={24} className="text-muted" />
            <div>
              <div className="font-medium">HDFC Interest Cert</div>
              <div className="text-muted text-sm">PDF • FY 25-26 • Processed ✓</div>
            </div>
          </div>
          <button className="btn btn-secondary text-sm" onClick={() => alert('Demo: Document downloaded.')}><Download size={14} /></button>
        </div>
      </div>
    </AppLayout>
  );
}



function IncomeOverview() {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <button className="btn btn-secondary text-sm mb-6" style={{ padding: '0.375rem 0.75rem' }} onClick={() => navigate('/app')}>
        ← Back to Dashboard
      </button>
      <h1 className="mb-2">Your income</h1>
      <p className="text-muted mb-8">FY 2025–26</p>
      <div className="grid-2">
        <div className="card">
          <div className="text-muted text-sm font-medium uppercase mb-1">Salary</div>
          <div className="metric-value">₹9,00,000</div>
          <div className="text-sm font-medium mt-2 flex items-center gap-1 text-success"><CheckCircle size={14}/> Reconciled</div>
        </div>
        <div className="card">
          <div className="text-muted text-sm font-medium uppercase mb-1">Interest</div>
          <div className="metric-value">₹30,400</div>
          <div className="text-sm font-medium mt-2 flex items-center gap-1 text-danger"><AlertTriangle size={14}/> Needs review</div>
        </div>
      </div>
    </AppLayout>
  );
}

function TaxComputation() {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <button className="btn btn-secondary text-sm mb-6" style={{ padding: '0.375rem 0.75rem' }} onClick={() => navigate('/app')}>
        ← Back to Dashboard
      </button>
      <h1 className="mb-2">Tax computation</h1>
      <p className="text-muted mb-8">FY 2025–26 demonstration estimate.</p>
      
      <div className="card mb-8">
        <div className="flex justify-between py-2"><span className="text-muted">Gross income</span><span className="font-medium">₹9,42,900</span></div>
        <div className="flex justify-between py-2"><span className="text-muted">Standard deduction</span><span className="font-medium text-success">- ₹50,000</span></div>
        <div className="flex justify-between py-4 border-t border-b my-2">
          <strong className="text-lg">Taxable income</strong>
          <strong className="text-lg">₹8,92,900</strong>
        </div>
        <div className="flex justify-between py-2 mb-4"><span className="text-muted">Estimated tax (New Regime)</span><span className="metric-value">₹39,290</span></div>
        
        <div className="text-muted text-sm mt-8 mb-4">
          <ShieldCheck size={16} className="inline mr-1" />
          <strong>Demo Note:</strong> In a live environment, this would securely transfer your reconciled data to a government-authorized filing portal.
        </div>
        <button className="btn btn-primary w-full py-3" onClick={() => alert('Demo: Proceeding to ITR Preparation portal...')}>Export to ITR Portal (Demo)</button>
      </div>
    </AppLayout>
  );
}

function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/signin" replace />;
  return children;
}

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  
  const handleSignIn = (e) => {
    e.preventDefault();
    login(username || 'Demo User');
  };

  return (
    <div className="public-layout flex items-center justify-center" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="flex items-center justify-center gap-3 mb-10">
          <Scale size={32} color="var(--primary)" />
          <h2 style={{ fontSize: '2rem', letterSpacing: '-0.5px', fontWeight: 600, margin: 0, padding: 0, lineHeight: 1 }}>ReconcileAI</h2>
        </div>
        
        <div className="card" style={{ padding: '2.5rem' }}>
          <h3 className="mb-6 text-center" style={{ fontSize: '1.25rem' }}>Welcome back</h3>
          <form onSubmit={handleSignIn}>
            <div className="mb-5">
              <label className="text-sm font-medium mb-2" style={{ display: 'block' }}>Username</label>
              <input required type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9375rem' }} placeholder="johndoe" />
            </div>
            <div className="mb-8">
              <label className="text-sm font-medium mb-2" style={{ display: 'block' }}>Password</label>
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9375rem' }} placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary w-full" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', fontWeight: 500, marginBottom: '1.5rem' }}>Sign In</button>
          </form>
          <p className="text-center text-sm text-muted">Don't have an account? <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign up</Link></p>
        </div>
        
        <div className="text-muted text-sm mt-6 flex items-center justify-center gap-1" style={{ fontSize: '0.8rem' }}>
          <ShieldCheck size={14}/> Prototype account — no real personal data is required.
        </div>
      </div>
    </div>
  );
}

function SignUp() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleSignUp = (e) => {
    e.preventDefault();
    login(name || username || 'Demo User');
  };

  return (
    <div className="public-layout flex items-center justify-center" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="flex items-center justify-center gap-3 mb-10">
          <Scale size={32} color="var(--primary)" />
          <h2 style={{ fontSize: '2rem', letterSpacing: '-0.5px', fontWeight: 600, margin: 0, padding: 0, lineHeight: 1 }}>ReconcileAI</h2>
        </div>
        
        <div className="card" style={{ padding: '2.5rem' }}>
          <h3 className="mb-6 text-center" style={{ fontSize: '1.25rem' }}>Create your ReconcileAI account</h3>
          <form onSubmit={handleSignUp}>
            <div className="mb-5">
              <label className="text-sm font-medium mb-2" style={{ display: 'block' }}>Full Name</label>
              <input required type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9375rem' }} placeholder="John Doe" />
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium mb-2" style={{ display: 'block' }}>Username</label>
              <input required type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9375rem' }} placeholder="johndoe" />
            </div>
            <div className="mb-8">
              <label className="text-sm font-medium mb-2" style={{ display: 'block' }}>Password</label>
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '0.9375rem' }} placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary w-full" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', fontWeight: 500, marginBottom: '1.5rem' }}>Sign Up</button>
          </form>
          <p className="text-center text-sm text-muted">Already have an account? <Link to="/signin" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign in</Link></p>
        </div>
        
        <div className="text-muted text-sm mt-6 flex items-center justify-center gap-1" style={{ fontSize: '0.8rem' }}>
          <ShieldCheck size={14}/> Prototype account — no real personal data is required.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (name) => {
    const u = { name };
    setUser(u);
    localStorage.setItem('auth_user', JSON.stringify(u));
    navigate('/app');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route path="/app" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/app/profile" element={<RequireAuth><ProfileChecklist /></RequireAuth>} />
        <Route path="/app/data-sources" element={<RequireAuth><DataSources /></RequireAuth>} />
        <Route path="/app/transactions" element={<RequireAuth><TransactionExplorer /></RequireAuth>} />
        <Route path="/app/documents" element={<RequireAuth><DocumentCenter /></RequireAuth>} />
        <Route path="/app/reconciliation/:id" element={<RequireAuth><ReviewDetail /></RequireAuth>} />
        <Route path="/app/income" element={<RequireAuth><IncomeOverview /></RequireAuth>} />
        <Route path="/app/tax-computation" element={<RequireAuth><TaxComputation /></RequireAuth>} />
      </Routes>
    </AuthContext.Provider>
  );
}
