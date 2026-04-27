import { useState, useEffect } from 'react'

const CATEGORIES = [
  { value: 'food', label: '🍽 Food & Dining' },
  { value: 'transport', label: '🚌 Transport' },
  { value: 'housing', label: '🏠 Housing' },
  { value: 'entertainment', label: '🎬 Entertainment' },
  { value: 'health', label: '💊 Health & Medical' },
  { value: 'shopping', label: '🛍 Shopping' },
  { value: 'utilities', label: '💡 Utilities' },
  { value: 'education', label: '📚 Education' },
  { value: 'travel', label: '✈️ Travel' },
  { value: 'other', label: '📦 Other' },
]

const today = () => new Date().toISOString().split('T')[0]

const s = {
  wrap: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '1.25rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.85rem',
  },
  fullCol: { gridColumn: '1 / -1' },
  label: {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '0.35rem',
  },
  input: {
    width: '100%',
    padding: '0.65rem 0.85rem',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '7px',
    color: 'var(--text)',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'var(--font-mono)',
    transition: 'border-color 150ms',
  },
  select: {
    width: '100%',
    padding: '0.65rem 0.85rem',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '7px',
    color: 'var(--text)',
    fontSize: '0.9rem',
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
  },
  error: {
    gridColumn: '1 / -1',
    padding: '0.6rem 0.85rem',
    background: 'rgba(255,92,92,0.1)',
    border: '1px solid rgba(255,92,92,0.3)',
    borderRadius: '7px',
    color: 'var(--danger)',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)',
  },
  btnRow: {
    gridColumn: '1 / -1',
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    marginTop: '0.25rem',
  },
  btn: {
    flex: 1,
    padding: '0.7rem',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '7px',
    fontSize: '0.875rem',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    cursor: 'pointer',
    transition: 'opacity 150ms',
  },
  btnDisabled: { opacity: 0.55, cursor: 'not-allowed' },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  statusText: {
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
  },
}

export default function ExpenseForm({ createExpense }) {
  const [form, setForm] = useState({ amount: '', category: 'food', description: '', date: today() })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    const amount = parseFloat(form.amount)
    if (isNaN(amount) || amount <= 0) { setError('Amount must be a positive number.'); return }

    setSubmitting(true)
    const result = await createExpense({
      ...form,
      amount: amount.toFixed(2),
    })
    setSubmitting(false)

    if (result.ok) {
      setSuccessMsg('Expense added!')
      setForm({ amount: '', category: 'food', description: '', date: today() })
      setTimeout(() => setSuccessMsg(''), 3000)
    } else {
      setError(result.error)
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.title}>— New Expense</div>
      <form style={s.grid} onSubmit={handleSubmit}>
        <div>
          <label style={s.label}>Amount (₹)</label>
          <input
            style={s.input}
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={set('amount')}
            required
          />
        </div>

        <div>
          <label style={s.label}>Date</label>
          <input
            style={s.input}
            type="date"
            value={form.date}
            onChange={set('date')}
            required
          />
        </div>

        <div>
          <label style={s.label}>Category</label>
          <select style={s.select} value={form.category} onChange={set('category')}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={s.label}>Description</label>
          <input
            style={s.input}
            type="text"
            placeholder="e.g. Lunch at office"
            value={form.description}
            onChange={set('description')}
            required
            maxLength={255}
          />
        </div>

        {error && <div style={s.error}>{error}</div>}

        <div style={s.btnRow}>
          <button
            style={{ ...s.btn, ...(submitting ? s.btnDisabled : {}) }}
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Saving…' : 'Add Expense +'}
          </button>
          {successMsg && (
            <>
              <span style={{ ...s.statusDot, background: 'var(--success)' }} />
              <span style={s.statusText}>{successMsg}</span>
            </>
          )}
        </div>
      </form>
    </div>
  )
}
