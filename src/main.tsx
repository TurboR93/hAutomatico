import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Sul sottodominio amministrazione.* monta il gestionale; altrimenti il sito pubblico.
// In locale (localhost) si può forzare l'admin con ?admin=1 (memorizzato per la sessione).
const isAdminHost = (): boolean => {
  const host = window.location.hostname
  if (host.startsWith('amministrazione')) return true
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')
  if (!isLocal) return false
  if (new URLSearchParams(window.location.search).has('admin')) {
    sessionStorage.setItem('admin', '1')
    return true
  }
  return sessionStorage.getItem('admin') === '1'
}

const AdminApp = lazy(() => import('./admin/AdminApp'))

const root = (
  <React.StrictMode>
    {isAdminHost() ? (
      <Suspense fallback={<div className="min-h-screen bg-[#FDF07A]" />}>
        <AdminApp />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>
)

ReactDOM.createRoot(document.getElementById('root')!).render(root)
