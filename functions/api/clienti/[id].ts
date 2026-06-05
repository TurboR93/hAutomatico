import {
  buildCliente,
  deleteClienteById,
  errorJson,
  getClienteById,
  json,
  updateCliente,
  validateCliente,
} from '../../_shared/db'
import { Env } from '../../_shared/types'

function idOf(params: Record<string, string | string[]>): string {
  const id = params.id
  return Array.isArray(id) ? id[0] : id
}

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const cliente = await getClienteById(env.DB, idOf(params))
  if (!cliente) return errorJson('Cliente non trovato', 404)
  return json({ cliente })
}

async function applyUpdate(request: Request, env: Env, id: string, partial: boolean): Promise<Response> {
  const existing = await getClienteById(env.DB, id)
  if (!existing) return errorJson('Cliente non trovato', 404)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorJson('JSON non valido', 400)
  }
  const { input, error } = validateCliente(body, { partial })
  if (error || !input) return errorJson(error ?? 'Input non valido', 400)

  const cliente = buildCliente(input, existing)
  await updateCliente(env.DB, cliente)
  return json({ cliente })
}

export const onRequestPut: PagesFunction<Env> = async ({ request, env, params }) =>
  applyUpdate(request, env, idOf(params), false)

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) =>
  applyUpdate(request, env, idOf(params), true)

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  const ok = await deleteClienteById(env.DB, idOf(params))
  if (!ok) return errorJson('Cliente non trovato', 404)
  return json({ ok: true })
}
