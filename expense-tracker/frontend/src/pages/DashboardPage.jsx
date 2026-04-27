import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useExpenses } from '../hooks/useExpenses.js'
import NavSidebar from '../components/NavSidebar.jsx'
import ExpenseForm from '../components/ExpenseForm.jsx'
import SummaryPanel from '../components/SummaryPanel.jsx'
import ExpenseHistoryView from '../components/ExpenseHistoryView.jsx'

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
  },
  mobileTopbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.9rem 1.25rem',
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface)',
    position: 'sticky',
    top: 0,
    zIndex: 30,
    flexShrink: 0,
  },
  mobileLogo: {
    fontSize: '1.15rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: 'var(--text)',
  },
  mobileMenuBtn: {
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: '7px',
    color: 'var(--text-muted)',
    padding: '0.4rem 0.7rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    height: '100vh',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    zIndex: 40,
    backdropFilter: 'blur(2px)',
  },
  mobileNavWrap: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 50,
    display: 'flex',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.75rem 2rem',
    minWidth: 0,
  },
  viewTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: 'var(--text)',
    marginBottom: '0.25rem',
  },
  viewSubtitle: {
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    marginBottom: '1.5rem',
  },
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [activeView, setActiveView] = useState('dashboard')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const {
    expenses, summary, loading, error, total,
    categoryFilter, setCategoryFilter,
    sortOrder, setSortOrder,
    createExpense,
  } = useExpenses()

  const handleNavigate = (view) => {
    setActiveView(view)
    setMobileNavOpen(false)
  }

  return (
    <div style={s.page}>
      {/* Mobile topbar */}
      <div style={{ ...s.mobileTopbar, display: 'none' }} className="kh-mobile-topbar">
        <div style={s.mobileLogo}>
          kharcha<span style={{ color: 'var(--accent)' }}>.</span>
        </div>
        <button style={s.mobileMenuBtn} onClick={() => setMobileNavOpen(true)}>☰</button>
      </div>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <>
          <div style={s.overlay} onClick={() => setMobileNavOpen(false)} />
          <div style={s.mobileNavWrap}>
            <NavSidebar activeView={activeView} onNavigate={handleNavigate} user={user} onLogout={logout} />
          </div>
        </>
      )}

      <div style={s.body}>
        {/* Desktop left nav */}
        <div className="kh-desktop-nav">
          <NavSidebar activeView={activeView} onNavigate={handleNavigate} user={user} onLogout={logout} />
        </div>

        {/* Main content area */}
        <main style={s.main}>
          {activeView === 'dashboard' && (
            <>
              <div style={s.viewTitle}>Dashboard</div>
              <div style={s.viewSubtitle}>Add expenses and view your spending overview</div>
              <ExpenseForm createExpense={createExpense} />
              <SummaryPanel expenses={expenses} summary={summary} total={total} loading={loading} />
            </>
          )}

          {activeView === 'history' && (
            <>
              <div style={s.viewTitle}>Expense History</div>
              <div style={s.viewSubtitle}>Browse, search, sort and filter all your expenses</div>
              <ExpenseHistoryView
                expenses={expenses}
                loading={loading}
                error={error}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
            </>
          )}
        </main>
      </div>

      <style>{`
        .kh-mobile-topbar { display: none; }
        .kh-desktop-nav { display: flex; height: 100vh; }

        @media (max-width: 768px) {
          .kh-mobile-topbar { display: flex !important; }
          .kh-desktop-nav { display: none; }
        }

        @media (max-width: 640px) {
          main { padding: 1.25rem 1rem !important; }
        }

        /* Summary panel responsive stacking */
        @media (max-width: 520px) {
          .kh-summary-row {
            grid-template-columns: 1fr !important;
          }
        }

        /* History table responsive columns */
        @media (max-width: 600px) {
          .kh-history-head,
          .kh-history-row {
            grid-template-columns: 2fr 1fr 1fr !important;
          }
          .kh-col-category { display: none !important; }
        }
      `}</style>
    </div>
  )
}
