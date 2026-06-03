import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../api'
import Loader from './Loader'

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<'checking' | 'ok' | 'no'>('checking')

  useEffect(() => {
    let active = true
    api
      .session()
      .then((ok) => active && setState(ok ? 'ok' : 'no'))
      .catch(() => active && setState('no'))
    return () => {
      active = false
    }
  }, [])

  if (state === 'checking') return <Loader fullScreen label="Verifica accesso…" />
  if (state === 'no') return <Navigate to="/login" replace />
  return <>{children}</>
}

export default RequireAuth
