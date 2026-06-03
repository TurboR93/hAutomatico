import {
  buildMovimento,
  deleteMovimentoById,
  errorJson,
  getMovimentoById,
  json,
  updateMovimento,
  validateInput,
} from '../../_shared/db'
import { Env } from '../../_shared/types'

function idOf(params: Record<string, string | string[]>): string {
  const id = params.id
  return Array.isArray(id) ? id[0] : id
}

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const record = await getMovimentoById(env.DB, idOf(params))
  if (!record) return errorJson('Movimento non trovato', 404)
  return json({ record })
}

async function applyUpdate(
  request: Request,
  env: Env,
  id: string,
  partial: boolean,
): Promise<Response> {
  const existing = await getMovimentoById(env.DB, id)
  if (!existing) return errorJson('Movimento non trovato', 404)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorJson('JSON non valido', 400)
  }
  // In modifica il tipo resta quello esistente se non fornito.
  const merged = { tipo: existing.tipo, ...(body as object) }
  const { input, error } = validateInput(merged, { partial })
  if (error || !input) return errorJson(error ?? 'Input non valido', 400)

  const record = buildMovimento(input, existing)
  await updateMovimento(env.DB, record)
  return json({ record })
}

export const onRequestPut: PagesFunction<Env> = async ({ request, env, params }) => {
  return applyUpdate(request, env, idOf(params), false)
}

export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  return applyUpdate(request, env, idOf(params), true)
}

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  const ok = await deleteMovimentoById(env.DB, idOf(params))
  if (!ok) return errorJson('Movimento non trovato', 404)
  return json({ ok: true })
}
