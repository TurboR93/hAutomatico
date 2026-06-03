// Hook di caricamento dati con gestione del 401 (redirect a /login).

import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from './api'

export function isAuthError(e: unknown): boolean {
  return e instanceof ApiError && e.status === 401
}

export function messageOf(e: unknown): string {
  return e instanceof Error ? e.message : 'Errore imprevisto'
}

export function useFetch<T>(loader: () => Promise<T>, deps: unknown[]) {
  const navigate = useNavigate()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Token per ignorare risposte obsolete (StrictMode, filtri digitati in fretta).
  const reqId = useRef(0)

  const reload = useCallback(() => {
    const id = ++reqId.current
    setLoading(true)
    setError(null)
    loader()
      .then((d) => {
        if (id === reqId.current) setData(d)
      })
      .catch((e) => {
        if (id !== reqId.current) return
        if (isAuthError(e)) navigate('/login')
        else setError(messageOf(e))
      })
      .finally(() => {
        if (id === reqId.current) setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    reload()
  }, [reload])

  return { data, loading, error, reload }
}
