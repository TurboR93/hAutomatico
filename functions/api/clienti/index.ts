import {
  buildCliente,
  errorJson,
  insertCliente,
  json,
  listClienti,
  validateCliente,
} from '../../_shared/db'
import { Env } from '../../_shared/types'

// GET /api/clienti?q=
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url)
  const clienti = await listClienti(env.DB, url.searchParams.get('q'))
  return json({ clienti })
}

// POST /api/clienti
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorJson('JSON non valido', 400)
  }
  const { input, error } = validateCliente(body)
  if (error || !input) return errorJson(error ?? 'Input non valido', 400)

  const cliente = buildCliente(input)
  await insertCliente(env.DB, cliente)
  return json({ cliente }, 201)
}
