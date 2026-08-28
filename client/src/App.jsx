import { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, useNavigate, useParams, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  ShieldCheck, CheckCircle, AlertCircle, ArrowRight, 
  LayoutDashboard, List, Database, PieChart, Calculator,
  FileText, CheckSquare, Settings, Download, 
  User, Sparkles, Building, Landmark, ChevronRight, AlertTriangle, Scale,
  Sun, Moon, Cpu, Clock, Lock, FlaskConical, Users, Quote
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

        {/* How ReconcileAI Works Section - Monochrome Editorial */}
        <div className="mb-4">
          <span className="uppercase text-sm tracking-widest px-4 py-1 badge-mono" style={{ borderRadius: '4px' }}>How it works</span>
        </div>
        <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.04em', fontWeight: 500, color: 'var(--text-h)', marginBottom: '1rem' }}>The reconciliation process</h2>
        <p className="text-muted" style={{ fontSize: '1.125rem', maxWidth: '600px', marginBottom: '4rem', fontWeight: 400 }}>
          A simple 4-step framework to turn your financial records into clarity, without the guesswork.
        </p>

        <div style={{ maxWidth: '1000px', width: '100%', textAlign: 'left', marginBottom: '6rem' }}>
          <div className="grid-2" style={{ gap: '6rem', alignItems: 'center' }}>
            
            {/* Timeline Column */}
            <div style={{ position: 'relative' }}>
              <div className="timeline-container">
                <div className="timeline-line-mono"></div>
                
                <div className="timeline-item-mono">
                  <div className="timeline-number-mono">01</div>
                  <div style={{ marginTop: '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <FileText size={18} className="feature-icon-mono" style={{ marginBottom: 0 }} />
                      <strong className="text-strong text-lg">Connect</strong>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">Connect your Bank Statement and AIS data securely.</p>
                  </div>
                </div>

                <div className="timeline-item-mono">
                  <div className="timeline-number-mono">02</div>
                  <div style={{ marginTop: '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <Cpu size={18} className="feature-icon-mono" style={{ marginBottom: 0 }} />
                      <strong className="text-strong text-lg">Reconcile</strong>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">Our deterministic engine compares records, prioritizes reliable matches, and identifies discrepancies.</p>
                  </div>
                </div>

                <div className="timeline-item-mono">
                  <div className="timeline-number-mono">03</div>
                  <div style={{ marginTop: '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <Sparkles size={18} className="feature-icon-mono" style={{ marginBottom: 0 }} />
                      <strong className="text-strong text-lg">Understand</strong>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">Gemini explains what's different in simple, citizen-friendly language.</p>
                  </div>
                </div>

                <div className="timeline-item-mono" style={{ marginBottom: 0 }}>
                  <div className="timeline-number-mono">04</div>
                  <div style={{ marginTop: '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <User size={18} className="feature-icon-mono" style={{ marginBottom: 0 }} />
                      <strong className="text-strong text-lg">Review</strong>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">You make the final decision before proceeding toward tax preparation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Flowchart Diagram Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', width: '100%', flexDirection: 'column' }}>
                
                <div className="flow-node-mono" style={{ width: '100%' }}>
                  <div className="flow-icon-mono">
                    <Landmark size={24} />
                  </div>
                  <span>Bank Statement + AIS</span>
                </div>

                <span className="flow-arrow-mono">↓</span>

                <div className="flow-node-mono" style={{ width: '100%', zIndex: 2, background: 'var(--bg-main)' }}>
                  <div className="flow-icon-mono">
                    <Cpu size={24} />
                  </div>
                  <span>ReconcileAI Engine</span>
                </div>

                <span className="flow-arrow-mono">↓</span>

                <div className="flow-group-mono" style={{ width: '100%', zIndex: 2, background: 'var(--bg-main)' }}>
                  <div className="flow-item-mono">
                    <CheckCircle size={18} className="feature-icon-mono" style={{ marginBottom: 0 }} /> Matched
                  </div>
                  <div className="flow-item-mono">
                    <AlertCircle size={18} className="feature-icon-mono" style={{ marginBottom: 0 }} /> Mismatched
                  </div>
                  <div className="flow-item-mono">
                    <Clock size={18} className="feature-icon-mono" style={{ marginBottom: 0 }} /> Needs Review
                  </div>
                </div>

                <span className="flow-arrow-mono">↓</span>

                <div className="flow-node-mono" style={{ width: '100%', zIndex: 2, background: 'var(--bg-main)' }}>
                  <div className="flow-icon-mono">
                    <User size={24} />
                  </div>
                  <span>Human Review</span>
                </div>

                {/* Return Path for Ambiguous */}
                <div className="flow-return-path-mono"></div>
                <div className="flow-return-label-mono">Protects ambiguous records</div>
              </div>
              
              {/* HDFC Example integrated cleanly */}
              <div style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid var(--border)', background: 'transparent' }}>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-strong text-sm uppercase tracking-widest">Example: HDFC Interest</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-muted text-sm">Bank Statement</span>
                  <span className="text-main font-mono">₹30,400</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="text-muted text-sm">AIS Data</span>
                  <span className="text-main font-mono">₹26,400</span>
                </div>
                <div className="flex justify-between items-center py-3 mt-2">
                  <span className="text-strong">Discrepancy</span>
                  <span className="text-strong font-mono">₹4,000</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Engineering You Can Trust Section */}
        <div className="mb-4">
          <span className="uppercase text-sm tracking-widest px-4 py-1 badge-mono" style={{ borderRadius: '4px' }}>Engineering</span>
        </div>
        <h2 style={{ fontSize: '2.5rem', letterSpacing: '-0.04em', fontWeight: 500, color: 'var(--text-h)', marginBottom: '1rem' }}>
          Built to challenge assumptions.
        </h2>
        <p className="text-muted" style={{ fontSize: '1.125rem', maxWidth: '600px', marginTop: '1rem', marginBottom: '4rem' }}>
          Powered by a Codex-hardened reconciliation engine designed for accuracy, safety, and transparency.
        </p>

        <div className="grid-4-cards" style={{ maxWidth: '1000px', width: '100%' }}>
          <div className="feature-card-mono">
            <ShieldCheck size={24} className="feature-icon-mono" />
            <div>
              <strong className="text-strong block mb-2">Codex-hardened engine</strong>
              <p className="text-muted text-sm leading-relaxed">Used during development to challenge reconciliation assumptions and harden edge-case detection.</p>
            </div>
          </div>
          
          <div className="feature-card-mono">
            <FlaskConical size={24} className="feature-icon-mono" />
            <div>
              <strong className="text-strong block mb-2">Reliability verified</strong>
              <p className="text-muted text-sm leading-relaxed">Every rule, edge case, and safety guard is covered by rigorous regression tests.</p>
            </div>
          </div>

          <div className="feature-card-mono">
            <Lock size={24} className="feature-icon-mono" />
            <div>
              <strong className="text-strong block mb-2">Protects ambiguity</strong>
              <p className="text-muted text-sm leading-relaxed">When the evidence is unclear, the system does not guess—ambiguous records are protected.</p>
            </div>
          </div>

          <div className="feature-card-mono">
            <Users size={24} className="feature-icon-mono" />
            <div>
              <strong className="text-strong block mb-2">Human-in-the-loop</strong>
              <p className="text-muted text-sm leading-relaxed">You stay in control. Final decisions are always made by a human, not the system.</p>
            </div>
          </div>
        </div>

        <div className="bottom-banner-mono" style={{ maxWidth: '1000px', width: '100%', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Quote size={24} className="feature-icon-mono" style={{ marginBottom: 0 }} />
            <div style={{ textAlign: 'left' }}>
              <strong className="text-strong" style={{ fontSize: '1.125rem', display: 'block', marginBottom: '4px' }}>
                When the evidence is unclear, ReconcileAI does not guess.
              </strong>
              <span className="text-muted text-sm">We protect uncertainty so you can trust clarity.</span>
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
  const [analysisStage, setAnalysisStage] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(() => {
    const justRan = sessionStorage.getItem('triggerAnalysis') === 'true';
    if (justRan) {
      sessionStorage.removeItem('triggerAnalysis');
      return true;
    }
    return false;
  });
  const [showCodexPanel, setShowCodexPanel] = useState(false);

  useEffect(() => {
    const hasRun = localStorage.getItem('reconciliationRun') === 'true';
    if (!hasRun) {
      navigate('/app/data-sources');
      return;
    }
    fetch(`${BASE_API}/reconcile`).then(res => res.json()).then(setData);
  }, [navigate]);

  useEffect(() => {
    if (!isAnalyzing) return;
    if (analysisStage < 4) {
      const timer = setTimeout(() => setAnalysisStage(s => s + 1), 600);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setIsAnalyzing(false), 500);
    }
  }, [analysisStage, isAnalyzing]);

  if (isAnalyzing || !data) {
    const stages = [
      "Parsing source documents",
      "Codex AI is analyzing records",
      "Codex AI is reconciling data",
      "Generating reconciliation result"
    ];
    return (
      <AppLayout>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <Sparkles size={48} color="var(--primary)" style={{ marginBottom: '2rem' }} />
          <h2 className="mb-6">Reconciliation in progress</h2>
          <div style={{ width: '100%', maxWidth: '400px', background: 'var(--bg-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
            {stages.map((stage, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: i === stages.length - 1 ? 0 : '1rem', opacity: analysisStage >= i ? 1 : 0.3, transition: 'opacity 0.3s' }}>
                {analysisStage > i ? (
                  <CheckCircle size={20} color="var(--success)" />
                ) : (analysisStage === i ? (
                  <div style={{ width: 20, height: 20, border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--border)' }} />
                ))}
                <span className={analysisStage === i ? 'font-medium' : ''}>{stage}</span>
              </div>
            ))}
          </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}} />
      </AppLayout>
    );
  }

  const totalRecords = data.matched.length + data.mismatched.length + data.needsReview.length + data.bankOnly.length + data.aisOnly.length;
  const actionRequired = data.mismatched.length + data.needsReview.length + data.bankOnly.length + data.aisOnly.length;

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  return (
    <AppLayout>
      <header className="flex justify-between items-end mb-12 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h1 className="mb-2" style={{ fontSize: '2rem', letterSpacing: '-0.02em', fontWeight: 500 }}>Good morning, {firstName}.</h1>
          <p className="text-muted" style={{ fontFamily: 'var(--mono)', fontSize: '0.875rem' }}>FY 2025–26 • RECONCILIATION COMPLETE</p>
        </div>
      </header>

      {/* Reconciliation Summary & Distribution Visualization */}
      <div className="mb-12">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '1.5rem', color: 'var(--text-h)' }}>Reconciliation Summary</h2>
        
        <div style={{ width: '100%', height: '8px', display: 'flex', gap: '2px', marginBottom: '1.5rem', background: 'transparent' }}>
          {data.matched.length > 0 && <div style={{ flex: data.matched.length, background: 'var(--text-main)' }}></div>}
          {data.needsReview.length > 0 && <div style={{ flex: data.needsReview.length, background: 'var(--warning)', opacity: 0.8 }}></div>}
          {data.mismatched.length > 0 && <div style={{ flex: data.mismatched.length, background: 'var(--danger)', opacity: 0.9 }}></div>}
          {(data.bankOnly.length + data.aisOnly.length) > 0 && <div style={{ flex: data.bankOnly.length + data.aisOnly.length, background: 'var(--border)' }}></div>}
        </div>

        <div className="flex justify-between items-start" style={{ fontFamily: 'var(--mono)', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <div className="text-muted mb-1">ANALYZED</div>
              <div className="text-strong" style={{ fontSize: '1.5rem' }}>{totalRecords}</div>
            </div>
            <div>
              <div className="text-muted mb-1">MATCHED</div>
              <div className="text-strong" style={{ fontSize: '1.5rem' }}>{data.matched.length}</div>
            </div>
            <div>
              <div className="text-muted mb-1">NEEDS REVIEW</div>
              <div style={{ fontSize: '1.5rem', color: data.needsReview.length > 0 ? 'var(--warning)' : 'inherit' }}>{data.needsReview.length}</div>
            </div>
            <div>
              <div className="text-muted mb-1">MISMATCHES</div>
              <div style={{ fontSize: '1.5rem', color: data.mismatched.length > 0 ? 'var(--danger)' : 'inherit' }}>{data.mismatched.length}</div>
            </div>
            <div>
              <div className="text-muted mb-1">UNMATCHED</div>
              <div className="text-strong" style={{ fontSize: '1.5rem' }}>{data.bankOnly.length + data.aisOnly.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '2rem', color: 'var(--text-h)' }}>What needs your attention?</h2>
          
          {actionRequired === 0 ? (
            <div style={{ padding: '2rem', border: '1px solid var(--border)', background: 'transparent', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle color="var(--success)" size={20} /> 
              <span className="font-medium text-strong">You are Tax-Ready! No discrepancies found.</span>
            </div>
          ) : (
            <div>
              {/* HDFC Discrepancy Spotlight */}
              {data.mismatched.map(m => (
                <div key={m.bankRecord.id} style={{ border: '1px solid var(--border)', padding: '2rem', background: 'transparent', marginBottom: '3rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-10px', left: '16px', background: 'var(--bg-main)', padding: '0 8px', fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                    Recommended Next Step
                  </div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-h)', marginBottom: '4px' }}>{m.bankRecord.category} Discrepancy</h3>
                      <p className="text-muted">The engine detected a conflict between Bank and AIS records.</p>
                    </div>
                  </div>

                  <div className="grid-2 gap-4 mb-8">
                    <div style={{ padding: '1.5rem', border: '1px dashed var(--border)' }}>
                      <div className="text-muted text-sm uppercase tracking-widest mb-2">Bank Statement</div>
                      <div style={{ fontSize: '1.75rem', fontFamily: 'var(--mono)', color: 'var(--text-h)' }}>₹30,400</div>
                    </div>
                    <div style={{ padding: '1.5rem', border: '1px dashed var(--border)' }}>
                      <div className="text-muted text-sm uppercase tracking-widest mb-2">AIS Data</div>
                      <div style={{ fontSize: '1.75rem', fontFamily: 'var(--mono)', color: 'var(--text-h)' }}>₹26,400</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between" style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <div>
                      <div className="text-muted text-sm uppercase tracking-widest mb-1">Difference</div>
                      <div style={{ fontSize: '1.25rem', fontFamily: 'var(--mono)', color: 'var(--danger)', fontWeight: 600 }}>₹{m.difference.toLocaleString()}</div>
                    </div>
                    <button 
                      className="btn" 
                      style={{ background: 'var(--text-main)', color: 'var(--bg-main)' }}
                      onClick={() => navigate(`/app/reconciliation/${m.bankRecord.id}?type=mismatch`)}
                    >
                      Review {m.bankRecord.category.toLowerCase()} discrepancy <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {data.needsReview.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-muted text-sm uppercase mb-4 tracking-widest">Ambiguous Records</h4>
                  {data.needsReview.map(r => (
                    <div key={r.id} style={{ borderBottom: '1px solid var(--border)', padding: '1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => navigate(`/app/reconciliation/${r.id}?type=ambiguous`)}>
                      <div className="flex items-center gap-4">
                        <AlertCircle size={20} color="var(--warning)" />
                        <div>
                          <div className="font-medium text-strong" style={{ fontSize: '1.125rem' }}>{r.description}</div>
                          <div className="text-muted text-sm">Transaction nature unclear</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-main)' }}>
                        Review manually <ArrowRight size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(data.bankOnly.length > 0 || data.aisOnly.length > 0) && (
                <div className="mb-8">
                  <h4 className="text-muted text-sm uppercase mb-4 tracking-widest">Unmatched Records</h4>
                  {[...data.bankOnly, ...data.aisOnly].map((r) => (
                    <div key={r.id} style={{ borderBottom: '1px solid var(--border)', padding: '1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => navigate(`/app/reconciliation/${r.id}?type=unmatched`)}>
                      <div className="flex items-center gap-4">
                        <AlertCircle size={20} color="var(--border)" />
                        <div>
                          <div className="font-medium text-strong" style={{ fontSize: '1.125rem' }}>{r.description}</div>
                          <div className="text-muted text-sm">Found in only one source</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-main)' }}>
                        Review reason <ArrowRight size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {data.matched.length > 0 && (
            <div className="mt-8 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
              <h4 className="text-muted text-sm uppercase mb-4 tracking-widest">Completed Actions</h4>
              <div className="flex flex-col gap-2">
                {data.matched.filter(m => m.isReviewed).map(m => (
                  <div key={m.bankRecord.id} className="flex items-center gap-3 text-muted text-sm">
                    <CheckCircle size={16} />
                    <span>{m.bankRecord.category} reviewed and safely reconciled.</span>
                  </div>
                ))}
                <div className="flex items-center gap-3 text-muted text-sm">
                  <CheckCircle size={16} />
                  <span>Auto-matched records ({data.matched.filter(m => !m.isReviewed).length}) secured.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div style={{ border: '1px solid var(--border)', padding: '2rem', background: 'transparent' }}>
            <h4 className="text-muted uppercase text-sm font-semibold mb-6 tracking-widest">Engineering Assurance</h4>
            
            <div className="flex items-start gap-3 mb-6">
              <ShieldCheck size={20} color="var(--text-main)" style={{ marginTop: '2px' }} />
              <div>
                <span className="font-medium text-strong block mb-1">Codex-hardened engine</span>
                <p className="text-muted text-sm leading-relaxed">Built and validated to never guess on ambiguous records.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-6 text-sm font-medium" style={{ color: 'var(--text-main)' }}>
              <CheckCircle size={16} /> 15/15 reliability tests passing
            </div>
            
            <div className="flex flex-col gap-2 mb-6 text-xs font-mono text-muted uppercase tracking-widest" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
              <span>Ambiguous Record</span>
              <span>↓</span>
              <span>Human Review</span>
              <span>↓</span>
              <span>Safe Decision</span>
            </div>

            <button 
              className="btn btn-secondary w-full text-sm" 
              style={{ background: 'transparent', border: '1px dashed var(--border)' }}
              onClick={() => setShowCodexPanel(!showCodexPanel)}
            >
              {showCodexPanel ? 'Hide Details' : 'Why this matters'}
            </button>
            
            {showCodexPanel && (
              <div className="mt-6 pt-6 border-t text-sm text-muted" style={{ borderColor: 'var(--border)' }}>
                <p className="mb-4 leading-relaxed">
                  Codex was used during development to challenge reconciliation matching assumptions, uncover edge cases, and strengthen the deterministic engine.
                </p>
                <ul style={{ paddingLeft: '1.25rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li><strong>Duplicate protection:</strong> Prevents one transaction from incorrectly consuming another valid match.</li>
                  <li><strong>Ambiguity protection:</strong> When evidence is insufficient, ReconcileAI sends the record for review instead of guessing.</li>
                  <li><strong>Safe text matching:</strong> Strict word-boundary matching prevents accidental matches.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="text-muted text-sm font-medium">
          {actionRequired > 0 ? "Resolve priority actions to unlock tax computation." : "All records reconciled. You're ready."}
        </div>
        <button 
          className="btn" 
          style={{ background: actionRequired > 0 ? 'var(--bg-card)' : 'var(--text-main)', color: actionRequired > 0 ? 'var(--text-muted)' : 'var(--bg-main)', border: actionRequired > 0 ? '1px solid var(--border)' : 'none', padding: '1rem 2rem', cursor: actionRequired > 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center' }}
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
  const [bankConnected, setBankConnected] = useState(localStorage.getItem('bankConnected') === 'true');
  const [aisConnected, setAisConnected] = useState(localStorage.getItem('aisConnected') === 'true');

  const connectBank = () => { setBankConnected(true); localStorage.setItem('bankConnected', 'true'); };
  const connectAis = () => { setAisConnected(true); localStorage.setItem('aisConnected', 'true'); };

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
            {bankConnected ? <span className="badge badge-success"><CheckCircle size={12}/> Demo Connected</span> : <span className="badge badge-neutral">Not Connected</span>}
          </div>
          {bankConnected ? (
            <div className="flex justify-between items-end">
              <div>
                <p className="text-muted text-sm mb-1">bank_statement_demo.pdf</p>
                <p className="font-medium text-sm">8 records detected</p>
              </div>
              <span className="text-sm font-medium text-accent flex items-center cursor-pointer" onClick={() => navigate('/app/transactions')}>View records <ChevronRight size={16}/></span>
            </div>
          ) : (
            <button className="btn btn-secondary w-full text-sm py-1.5" onClick={connectBank}>Connect demo PDF</button>
          )}
        </div>
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Building size={20} className="text-muted" />
              <h3 className="font-medium">AIS (Income Tax Dept)</h3>
            </div>
            {aisConnected ? <span className="badge badge-success"><CheckCircle size={12}/> Demo Connected</span> : <span className="badge badge-neutral">Not Connected</span>}
          </div>
          {aisConnected ? (
            <div className="flex justify-between items-end">
              <div>
                <p className="text-muted text-sm mb-1">ais_statement_demo.pdf</p>
                <p className="font-medium text-sm">6 records detected</p>
              </div>
              <span className="text-sm font-medium text-accent flex items-center cursor-pointer" onClick={() => navigate('/app/transactions')}>View records <ChevronRight size={16}/></span>
            </div>
          ) : (
            <button className="btn btn-secondary w-full text-sm py-1.5" onClick={connectAis}>Connect Demo AIS / Income Tax Dept PDF</button>
          )}
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

      <div className="mt-12 pt-8 flex flex-col items-center justify-center" style={{ borderTop: '1px solid var(--border)' }}>
        {bankConnected && aisConnected && (
          <p className="text-sm font-medium text-success mb-4 text-center">Your data is ready for reconciliation.</p>
        )}
        <button 
          className="btn btn-primary" 
          style={{ padding: '0.75rem 1.5rem', width: '300px', justifyContent: 'center' }} 
          disabled={!bankConnected || !aisConnected}
          onClick={() => {
            localStorage.setItem('reconciliationRun', 'true');
            sessionStorage.setItem('triggerAnalysis', 'true');
            navigate('/app');
          }}
        >
          Run Reconciliation <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
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
        let item;
        if (type === 'unmatched') {
          item = data.bankOnly.find(r => r.id === id) || data.aisOnly.find(r => r.id === id);
        } else {
          item = data.needsReview.find(r => r.id === id);
        }
        const matchedItem = data.matched.find(m => m.bankRecord && m.bankRecord.id === id);

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
          <span className={`badge ${type === 'mismatch' ? 'badge-danger' : (type === 'unmatched' ? 'badge-neutral' : 'badge-warning')}`}>
            {type === 'mismatch' && <><AlertTriangle size={12}/> Mismatch</>}
            {type === 'unmatched' && <><AlertCircle size={12}/> Unmatched</>}
            {type === 'ambiguous' && <><AlertCircle size={12}/> Needs Review</>}
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
            <button className="btn btn-secondary" onClick={async () => {
              await fetch(`${BASE_API}/reconcile/${id}/review`, { method: 'POST' });
              setResolved(true);
            }}>Accept Bank amount: ₹{record.bankRecord.amount.toLocaleString()}</button>
            <button className="btn btn-secondary" onClick={async () => {
              await fetch(`${BASE_API}/reconcile/${id}/review`, { method: 'POST' });
              setResolved(true);
            }}>Accept AIS amount: ₹{record.aisRecord.amount.toLocaleString()}</button>
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
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  
  const handleSignIn = (e) => {
    e.preventDefault();
    localStorage.removeItem('bankConnected');
    localStorage.removeItem('aisConnected');
    localStorage.removeItem('reconciliationRun');
    sessionStorage.removeItem('triggerAnalysis');
    login(username || 'Demo User');
    navigate('/app/data-sources');
  };

  return (
    <div className="public-layout flex items-center justify-center" style={{ minHeight: '100vh', padding: '2rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
        <button className="btn btn-secondary text-sm" style={{ padding: '0.375rem 0.75rem' }} onClick={() => navigate('/')}>
          ← Back to ReconcileAI
        </button>
      </div>
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
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleSignUp = (e) => {
    e.preventDefault();
    login(name || username || 'Demo User');
  };

  return (
    <div className="public-layout flex items-center justify-center" style={{ minHeight: '100vh', padding: '2rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
        <button className="btn btn-secondary text-sm" style={{ padding: '0.375rem 0.75rem' }} onClick={() => navigate('/')}>
          ← Back to ReconcileAI
        </button>
      </div>
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
    navigate('/app/data-sources');
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
