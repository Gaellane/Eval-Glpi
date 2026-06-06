import { useState, useEffect } from 'react'
import api from '../services/api'

export function useFetch(url, options = {}, dependencies = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data: result } = await apiCall(url, options.method || 'GET', options.headers, options.body || null)
        setData(result)
        setError(null)
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }

    if (url) fetchData()
  }, [url, ...dependencies])

  return { data, loading, error, refetch: () => {} }
}