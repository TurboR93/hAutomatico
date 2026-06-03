import {
  buildMovimento,
  errorJson,
  insertMovimento,
  json,
  listMovimenti,
  validateInput,
} from '../../_shared/db'
import { Env } from '../../_shared/types'

// GET /api/records?tipo=&stato=&from=&to=&q=&limit=
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url)
  const p = url.searchParams
  const limitRaw = p.get('limit')
  const records = await listMovimenti(env.DB, {
    tipo: p.get('tipo'),
    stato: p.get('stato'),
    from: p.get('from'),
    to: p.get('to'),
    q: p.get('q'),
    limit: limitRaw ? parseInt(limitRaw, 10) : null,
  })
  return json({ records })
}

// POST /api/records
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorJson('JSON non valido', 400)
  }
  const { input, error } = validateInput(body)
  if (error || !input) return errorJson(error ?? 'Input non valido', 400)

  const record = buildMovimento(input)
  await insertMovimento(env.DB, record)
  return json({ record }, 201)
}
