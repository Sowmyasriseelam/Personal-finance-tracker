import { useState } from 'react'

const EMOJI = {
  food: '🍽', transport: '🚌', housing: '🏠', entertainment: '🎬',
  health: '💊', shopping: '🛍', utilities: '💡', education: '📚',
  travel: '✈️', other: '📦',
}

const LABEL_MAP = {
  food: 'Food & Dining', transport: 'Transport', housing: 'Housing',
  entertainment: 'Entertainment', health: 'Health & Medical', shopping: 'Shopping',
  utilities: 'Utilities', education: 'Education', travel: 'Travel', other: 'Other',
}

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'food', label: '🍽 Food & Dining' },
  { value: 'transport', label: '🚌 Transport' },
  { value: 'housing', label: '🏠 Housing' },
  { value: 'entertainment', label: '🎬 Entertainment' },
  { value: 'health', label: '💊 Health' },
  { value: 'shopping', label: '🛍 Shopping' },
  { value: 'utilities', label: '💡 Utilities' },
  { value: 'education', label: '📚 Education' },
  { value: 'travel', label: '✈️ Travel' },
  { value: 'other', label: '📦 Other' },
]

function formatDate(str) {
  const d = new Date(str + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })
}

const s = {
  wrap: {},
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginBottom: '1.25rem',
  },
  title: {
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--text-dim)',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    flexWrap: 'wrap',
  },
  controlLabel: {
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-dim)',
    whiteSpace: 'nowrap',
  },
  select: {
    padding: '0.45rem 0.8rem',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '7px',
    color: 'var(--text)',
    fontSize: '0.82rem',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    appearance: 'none',
  },
  sortGroup: {
    display: 'flex',
    border: '1px solid var(--border)',
    borderRadius: '7px',
    overflow: 'hidden',
  },
  sortBtn: {
    padding: '0.45rem 0.8rem',
    border: 'none',
    background: 'var(--surface)',
    color: 'var(--text-muted)',
    fontSize: '0.78rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    transition: 'all 150ms',
  },
  sortBtnDivider: {
    borderRight: '1px solid var(--border)',
  },
  sortBtnActive: {
    background: 'var(--accent-dim)',
    color: 'var(--accent)',
  },
  searchInput: {
    padding: '0.45rem 0.8rem',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '7px',
    color: 'var(--text)',
    fontSize: '0.82rem',
    outline: 'none',
    fontFamily: 'var(--font-mono)',
    width: '180px',
    transition: 'border-color 150ms',
  },
  table: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    width: '100%',
  },
  tableHead: {
    display: 'grid',
    gridTemplateColumns: '2.5fr 1.5fr 1fr 1fr',
    padding: '0.85rem 1.25rem',
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface2)',
    gap: '0.5rem',
  },
  th: {
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-dim)',
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  thRight: {
    justifyContent: 'flex-end',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '2.5fr 1.5fr 1fr 1fr',
    padding: '0.9rem 1.25rem',
    borderBottom: '1px solid var(--border)',
    gap: '0.5rem',
    alignItems: 'center',
    transition: 'background 150ms',
    cursor: 'default',
  },
  desc: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  catCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  catIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '7px',
    background: 'var(--surface2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    flexShrink: 0,
  },
  catText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  amount: {
    fontSize: '0.9rem',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent)',
    textAlign: 'right',
  },
  date: {
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-dim)',
  },
  empty: {
    padding: '3.5rem',
    textAlign: 'center',
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem',
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
  },
  errorBox: {
    padding: '1.5rem',
    textAlign: 'center',
    color: 'var(--danger)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
  },
  statsBar: {
    display: 'flex',
    gap: '1.5rem',
    padding: '0.75rem 1.25rem',
    borderTop: '1px solid var(--border)',
    background: 'var(--surface2)',
    flexWrap: 'wrap',
  },
  stat: {
    fontSize: '0.72rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
  },
  statVal: {
    color: 'var(--accent)',
    fontWeight: 600,
  },
}

export default function ExpenseHistoryView({ expenses, loading, error, categoryFilter, setCategoryFilter, sortOrder, setSortOrder }) {
  const [search, setSearch] = useState('')
  const [colSort, setColSort] = useState(null) // 'amount_asc' | 'amount_desc' | 'alpha_asc' | 'alpha_desc'

  if (loading) return <div style={s.table}><div style={s.loading}>Loading expenses…</div></div>
  if (error) return <div style={s.table}><div style={s.errorBox}>{error}</div></div>

  // Filter by search term
  let filtered = expenses
  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter(e =>
      e.description.toLowerCase().includes(q) ||
      (LABEL_MAP[e.category] || e.category).toLowerCase().includes(q)
    )
  }

  // Column sort override
  if (colSort === 'amount_desc') filtered = [...filtered].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
  else if (colSort === 'amount_asc') filtered = [...filtered].sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount))
  else if (colSort === 'alpha_asc') filtered = [...filtered].sort((a, b) => a.description.localeCompare(b.description))
  else if (colSort === 'alpha_desc') filtered = [...filtered].sort((a, b) => b.description.localeCompare(a.description))

  const filteredTotal = filtered.reduce((sum, e) => sum + parseFloat(e.amount), 0)

  const handleColSort = (col) => {
    if (col === 'amount') {
      setColSort(prev => prev === 'amount_desc' ? 'amount_asc' : 'amount_desc')
    } else if (col === 'alpha') {
      setColSort(prev => prev === 'alpha_asc' ? 'alpha_desc' : 'alpha_asc')
    }
  }

  const getSortArrow = (col) => {
    if (col === 'amount') {
      if (colSort === 'amount_desc') return ' ↓'
      if (colSort === 'amount_asc') return ' ↑'
    }
    if (col === 'alpha') {
      if (colSort === 'alpha_asc') return ' ↑'
      if (colSort === 'alpha_desc') return ' ↓'
    }
    return ''
  }

  return (
    <div style={s.wrap}>
      {/* Controls */}
      <div style={s.header}>
        <div style={s.title}>— Expense History</div>
        <div style={s.controls}>
          <input
            style={s.searchInput}
            type="text"
            placeholder="Search expenses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
          <span style={s.controlLabel}>Category</span>
          <select
            style={s.select}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <span style={s.controlLabel}>Sort</span>
          <div style={s.sortGroup}>
            <button
              style={{ ...s.sortBtn, ...s.sortBtnDivider, ...(sortOrder === 'date_desc' ? s.sortBtnActive : {}) }}
              onClick={() => { setSortOrder('date_desc'); setColSort(null) }}
            >
              Newest ↓
            </button>
            <button
              style={{ ...s.sortBtn, ...(sortOrder === 'date_asc' ? s.sortBtnActive : {}) }}
              onClick={() => { setSortOrder('date_asc'); setColSort(null) }}
            >
              Oldest ↑
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={s.table}>
        <div style={s.tableHead}>
          <div style={{ ...s.th, cursor: 'pointer' }} onClick={() => handleColSort('alpha')}>
            Description{getSortArrow('alpha')}
          </div>
          <div style={s.th}>Category</div>
          <div style={{ ...s.th, ...s.thRight, cursor: 'pointer' }} onClick={() => handleColSort('amount')}>
            Amount{getSortArrow('amount')}
          </div>
          <div style={s.th}>Date</div>
        </div>

        {filtered.length === 0 ? (
          <div style={s.empty}>
            {search ? `No results for "${search}"` : 'No expenses yet — add one from Dashboard'}
          </div>
        ) : (
          filtered.map((e) => (
            <div
              key={e.id}
              style={s.row}
              onMouseEnter={(el) => el.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={(el) => el.currentTarget.style.background = 'transparent'}
            >
              <span style={s.desc} title={e.description}>{e.description}</span>
              <div style={s.catCell}>
                <div style={s.catIcon}>{EMOJI[e.category] || '📦'}</div>
                <span style={s.catText}>{LABEL_MAP[e.category] || e.category}</span>
              </div>
              <span style={s.amount}>
                ₹{parseFloat(e.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span style={s.date}>{formatDate(e.date)}</span>
            </div>
          ))
        )}

        {filtered.length > 0 && (
          <div style={s.statsBar}>
            <span style={s.stat}>
              Showing <span style={s.statVal}>{filtered.length}</span> of {expenses.length} entries
            </span>
            <span style={s.stat}>
              Total: <span style={s.statVal}>
                ₹{filteredTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
