import { deleteAllegatoRow, errorJson, getAllegatoById, json } from '../../_shared/db'
import { Env } from '../../_shared/types'

function idOf(params: Record<string, string | string[]>): string {
  const id = params.id
  return Array.isArray(id) ? id[0] : id
}

// GET /api/allegati/:id        -> visualizza il file (inline)
// GET /api/allegati/:id?dl=1   -> forza il download
export const onRequestGet: PagesFunction<Env> = async ({ env, params, request }) => {
  const a = await getAllegatoById(env.DB, idOf(params))
  if (!a) return errorJson('Allegato non trovato', 404)

  const obj = await env.DOCS.get(a.r2_key)
  if (!obj) return errorJson('File non trovato', 404)

  const dl = new URL(request.url).searchParams.get('dl') === '1'
  const headers = new Headers()
  headers.set('Content-Type', a.content_type || 'application/octet-stream')
  headers.set(
    'Content-Disposition',
    `${dl ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(a.filename)}`,
  )
  headers.set('Content-Length', String(a.size))
  headers.set('Cache-Control', 'private, no-store')
  return new Response(obj.body, { headers })
}

// DELETE /api/allegati/:id
export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  const a = await getAllegatoById(env.DB, idOf(params))
  if (!a) return errorJson('Allegato non trovato', 404)
  try {
    await env.DOCS.delete(a.r2_key)
  } catch {
    /* best-effort */
  }
  await deleteAllegatoRow(env.DB, a.id)
  return json({ ok: true })
}
