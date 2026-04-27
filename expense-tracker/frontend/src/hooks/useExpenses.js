import { useState, useEffect, useCallback } from 'react'
import client from '../api/client.js'
import { v4 as uuidv4 } from '../utils/uuid.js'

/**
 * Custom hook for expense data management.
 *
 * Idempotency strategy:
 * - Before submitting, we generate a UUID and store it in sessionStorage.
 * - On success we clear it. On failure/retry, the same key is reused.
 * - This means double-clicks, page refreshes mid-submit, and slow networks
 *   all result in exactly one expense being created.
 */
export function useExpenses() {
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Active filters
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortOrder, setSortOrder] = useState('date_desc')

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (categoryFilter) params.category = categoryFilter
      if (sortOrder) params.sort = sortOrder

      const [expRes, sumRes] = await Promise.all([
        client.get('/expenses/', { params }),
        client.get('/expenses/summary/', {
          params: categoryFilter ? { category: categoryFilter } : {},
        }),
      ])
      setExpenses(expRes.data)
      setSummary(sumRes.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load expenses.')
    } finally {
      setLoading(false)
    }
  }, [categoryFilter, sortOrder])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const createExpense = useCallback(async (formData) => {
    // Retrieve or generate idempotency key for this submission attempt
    const storageKey = 'pending_idempotency_key'
    let idempotencyKey = sessionStorage.getItem(storageKey)
    if (!idempotencyKey) {
      idempotencyKey = uuidv4()
      sessionStorage.setItem(storageKey, idempotencyKey)
    }

    try {
      const { data, status } = await client.post('/expenses/', {
        ...formData,
        idempotency_key: idempotencyKey,
      })

      // Clear the pending key on confirmed success
      sessionStorage.removeItem(storageKey)

      // Prepend to list if new (201), or it was already there (200 idempotent)
      if (status === 201) {
        setExpenses((prev) => [data, ...prev])
      } else {
        // Expense already exists — ensure it's in the list
        setExpenses((prev) =>
          prev.some((e) => e.id === data.id) ? prev : [data, ...prev]
        )
      }

      // Refresh summary totals
      fetchExpenses()

      return { ok: true }
    } catch (err) {
      const msg =
        err.response?.data?.amount?.[0] ||
        err.response?.data?.category?.[0] ||
        err.response?.data?.description?.[0] ||
        err.response?.data?.date?.[0] ||
        err.response?.data?.detail ||
        'Failed to save expense.'
      return { ok: false, error: msg }
    }
  }, [fetchExpenses])

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)

  return {
    expenses,
    summary,
    loading,
    error,
    total,
    categoryFilter,
    setCategoryFilter,
    sortOrder,
    setSortOrder,
    createExpense,
    refetch: fetchExpenses,
  }
}
