const s = {
  nav: {
    width: '220px',
    flexShrink: 0,
    borderRight: '1px solid var(--border)',
    background: 'var(--surface)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
  },
  logo: {
    padding: '1.5rem 1.25rem 1.25rem',
    borderBottom: '1px solid var(--border)',
    fontSize: '1.2rem',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: 'var(--text)',
    flexShrink: 0,
  },
  logoAccent: { color: 'var(--accent)' },
  navSection: {
    padding: '1.25rem 0.75rem',
    flex: 1,
  },
  sectionLabel: {
    fontSize: '0.55rem',
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'var(--text-dim)',
    padding: '0 0.5rem',
    marginBottom: '0.5rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.65rem 0.85rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 150ms',
    marginBottom: '0.2rem',
    border: 'none',
    background: 'transparent',
    width: '100%',
    textAlign: 'left',
    color: 'var(--text-muted)',
    fontSize: '0.875rem',
    fontWeight: 600,
    fontFamily: 'var(--font-display)',
  },
  navItemActive: {
    background: 'var(--accent-dim)',
    color: 'var(--accent)',
  },
  navIcon: {
    fontSize: '1rem',
    lineHeight: 1,
    width: '20px',
    textAlign: 'center',
    flexShrink: 0,
  },
  activeBar: {
    width: '3px',
    height: '16px',
    background: 'var(--accent)',
    borderRadius: '2px',
    marginLeft: 'auto',
    flexShrink: 0,
  },
  footer: {
    padding: '1rem 0.75rem',
    borderTop: '1px solid var(--border)',
    flexShrink: 0,
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '0.5rem 0.5rem',
    marginBottom: '0.5rem',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'var(--accent-dim)',
    border: '1px solid var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'var(--accent)',
    flexShrink: 0,
  },
  username: {
    fontSize: '0.78rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    width: '100%',
    padding: '0.5rem',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: '7px',
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    transition: 'all 150ms',
    letterSpacing: '0.04em',
  },
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬡' },
  { id: 'history', label: 'Expense History', icon: '⊞' },
]

export default function NavSidebar({ activeView, onNavigate, user, onLogout }) {
  return (
    <nav style={s.nav}>
      <div style={s.logo}>
        finance tracker<span style={s.logoAccent}>.</span>
      </div>

      <div style={s.navSection}>
        <div style={s.sectionLabel}>Menu</div>
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              style={{ ...s.navItem, ...(isActive ? s.navItemActive : {}) }}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--surface2)'
                  e.currentTarget.style.color = 'var(--text)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }
              }}
            >
              <span style={s.navIcon}>{item.icon}</span>
              {item.label}
              {isActive && <div style={s.activeBar} />}
            </button>
          )
        })}
      </div>

      <div style={s.footer}>
        <div style={s.userRow}>
          <div style={s.avatar}>
            {user?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <span style={s.username}>{user?.username}</span>
        </div>
        <button
          style={s.logoutBtn}
          onClick={onLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-light)'
            e.currentTarget.style.color = 'var(--text)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--text-muted)'
          }}
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
