import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, FileText, BarChart3 } from 'lucide-react';
import { useAppStore } from './store/useAppStore';

// Placeholders for now
import Dashboard from './pages/Dashboard';
import CaseDetail from './pages/CaseDetail';
import AuditLog from './pages/AuditLog';
import Analytics from './pages/Analytics';

function Sidebar() {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/audit', label: 'Audit Log', icon: FileText },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <Activity size={28} />
        RecoverAI
      </div>
      <div style={{ padding: '0 12px' }}>
        <span className="badge" style={{ background: 'var(--bg-active)', color: 'var(--primary)', fontSize: '11px', letterSpacing: '0.5px' }}>
          DEMO MODE
        </span>
      </div>
      <div className="nav-links">
        {navItems.map(item => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function App() {
  const initializeData = useAppStore(state => state.initializeData);
  const cases = useAppStore(state => state.cases);

  useEffect(() => {
    if (cases.length === 0) {
      initializeData();
    }
  }, [cases.length, initializeData]);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/case/:id" element={<CaseDetail />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
