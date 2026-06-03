// Client tipizzato per le API /api/* dell'area amministrazione.
// Tutte le richieste includono il cookie di sessione (credentials: 'include').

import { Movimento, MovimentoInput, Summary } from './types'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  let data: unknown = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!res.ok) {
    const message = (data as { error?: string } | null)?.error || `Errore ${res.status}`
    throw new ApiError(res.status, message)
  }
  return data as T
}

export interface RecordFilters {
  tipo?: string
  stato?: string
  from?: string
  to?: string
  q?: string
  limit?: number
}

function toQuery(filters: RecordFilters): string {
  const p = new URLSearchParams()
  if (filters.tipo) p.set('tipo', filters.tipo)
  if (filters.stato) p.set('stato', filters.stato)
  if (filters.from) p.set('from', filters.from)
  if (filters.to) p.set('to', filters.to)
  if (filters.q) p.set('q', filters.q)
  if (filters.limit) p.set('limit', String(filters.limit))
  const s = p.toString()
  return s ? `?${s}` : ''
}

export const api = {
  async login(password: string): Promise<void> {
    await request('/login', { method: 'POST', body: JSON.stringify({ password }) })
  },

  async logout(): Promise<void> {
    await request('/logout', { method: 'POST' })
  },

  async session(): Promise<boolean> {
    const r = await request<{ authenticated: boolean }>('/session')
    return r.authenticated
  },

  async listRecords(filters: RecordFilters = {}): Promise<Movimento[]> {
    const r = await request<{ records: Movimento[] }>(`/records${toQuery(filters)}`)
    return r.records
  },

  async createRecord(input: MovimentoInput): Promise<Movimento> {
    const r = await request<{ record: Movimento }>('/records', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return r.record
  },

  async updateRecord(id: string, input: MovimentoInput): Promise<Movimento> {
    const r = await request<{ record: Movimento }>(`/records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    })
    return r.record
  },

  async patchRecord(id: string, partial: Partial<MovimentoInput>): Promise<Movimento> {
    const r = await request<{ record: Movimento }>(`/records/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(partial),
    })
    return r.record
  },

  async deleteRecord(id: string): Promise<void> {
    await request(`/records/${id}`, { method: 'DELETE' })
  },

  async summary(): Promise<Summary> {
    return request<Summary>('/summary')
  },

  exportUrl(format: 'json' | 'csv'): string {
    return `/api/export?format=${format}`
  },
}
