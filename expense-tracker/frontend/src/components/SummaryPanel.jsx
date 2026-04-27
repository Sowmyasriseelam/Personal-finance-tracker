const EMOJI = {
  food: '🍽', transport: '🚌', housing: '🏠', entertainment: '🎬',
  health: '💊', shopping: '🛍', utilities: '💡', education: '📚',
  travel: '✈️', other: '📦',
}

const LABEL_MAP = {
  food: 'Food & Dining', transport: 'Transport', housing: 'Housing',
  entertainment: 'Entertainment', health: 'Health', shopping: 'Shopping',
  utilities: 'Utilities', education: 'Education', travel: 'Travel', other: 'Other',
}

const COLORS = [
  '#a855f7', '#4ade80', '#60a5fa', '#f87171', '#a78bfa',
  '#fb923c', '#34d399', '#f472b6', '#38bdf8', '#facc15',
]

function fmt(n) {
  return parseFloat(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const s = {
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  // Note: responsive stacking via kh-summary-row class in DashboardPage styles
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1.25rem 1.5rem',
  },
  cardLabel: {
    fontSize: '0.58rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--text-dim)',
    marginBottom: '0.5rem',
  },
  totalAmount: {
    fontSize: '2rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: 'var(--accent)',
    fontFamily: 'var(--font-mono)',
    lineHeight: 1,
    marginBottom: '0.3rem',
  },
  totalCount: {
    fontSize: '0.72rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
  },
  catGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  },
  catRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  catTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  catLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
  },
  catEmoji: { fontSize: '0.85rem', lineHeight: 1 },
  catName: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--text)',
  },
  catRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  catAmount: {
    fontSize: '0.78rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--text)',
  },
  catPct: {
    fontSize: '0.65rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-dim)',
  },
  barTrack: {
    height: '3px',
    background: 'var(--border)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  emptyMsg: {
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-dim)',
    padding: '0.5rem 0',
  },
  loadingMsg: {
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    padding: '0.5rem 0',
  },
}

export default function SummaryPanel({ expenses, summary, total, loading }) {
  const grandTotal = total || 0

  return (
    <div style={s.row} className="kh-summary-row">
      {/* Total spent card */}
      <div style={s.card}>
        <div style={s.cardLabel}>— Total Spent</div>
        <div style={s.totalAmount}>
          ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={s.totalCount}>
          {loading ? '…' : `${expenses.length} ${expenses.length === 1 ? 'expense' : 'expenses'}`}
        </div>
      </div>

      {/* Category breakdown card */}
      <div style={s.card}>
        <div style={s.cardLabel}>— By Category</div>
        <div style={s.catGrid}>
          {loading ? (
            <div style={s.loadingMsg}>Loading…</div>
          ) : summary.length === 0 ? (
            <div style={s.emptyMsg}>No data yet</div>
          ) : (
            summary.map((item, i) => {
              const pct = grandTotal > 0 ? (parseFloat(item.total) / grandTotal) * 100 : 0
              const color = COLORS[i % COLORS.length]
              return (
                <div key={item.category} style={s.catRow}>
                  <div style={s.catTop}>
                    <div style={s.catLeft}>
                      <span style={s.catEmoji}>{EMOJI[item.category] || '📦'}</span>
                      <span style={s.catName}>{LABEL_MAP[item.category] || item.category}</span>
                    </div>
                    <div style={s.catRight}>
                      <span style={s.catAmount}>₹{fmt(item.total)}</span>
                      <span style={s.catPct}>{pct.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div style={s.barTrack}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: color,
                      borderRadius: '2px',
                      transition: 'width 500ms ease',
                    }} />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
