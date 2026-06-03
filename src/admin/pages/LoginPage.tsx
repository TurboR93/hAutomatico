import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, LogIn } from 'lucide-react'
import { api } from '../api'
import { messageOf } from '../useFetch'

const LoginPage = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Se già autenticato, vai diretto alla panoramica.
  useEffect(() => {
    api.session().then((ok) => {
      if (ok) navigate('/', { replace: true })
    })
  }, [navigate])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.login(password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(messageOf(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDF07A] px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <img src="/logohAutomatico-red.png" alt="hAutomatico" className="h-16 w-auto object-contain" />
          <h1 className="mt-4 text-xl font-black tracking-tight">Area Amministrazione</h1>
          <p className="mt-1 text-sm text-black/50">Accesso riservato</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <Lock size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full rounded-xl border border-black/15 bg-white py-3 pl-10 pr-3 text-sm focus:border-[#D03F29] focus:outline-none"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-2 text-center text-sm font-medium text-[#D03F29]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#D03F29] py-3 text-sm font-bold text-white transition-colors hover:bg-[#b5331f] disabled:opacity-60"
          >
            <LogIn size={18} />
            {loading ? 'Accesso…' : 'Entra'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default LoginPage
