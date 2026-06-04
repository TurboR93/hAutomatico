import {
  errorJson,
  getMovimentoById,
  insertAllegato,
  json,
  listAllegatiByMovimento,
} from '../../../_shared/db'
import { Allegato, Env } from '../../../_shared/types'

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB per file

function idOf(params: Record<string, string | string[]>): string {
  const id = params.id
  return Array.isArray(id) ? id[0] : id
}

// Espone solo i metadati (mai la r2_key interna).
function meta(a: Allegato) {
  return {
    id: a.id,
    movimento_id: a.movimento_id,
    filename: a.filename,
    content_type: a.content_type,
    size: a.size,
    created_at: a.created_at,
  }
}

// GET /api/records/:id/allegati -> elenco allegati del movimento
export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const list = await listAllegatiByMovimento(env.DB, idOf(params))
  return json({ allegati: list.map(meta) })
}

// POST /api/records/:id/allegati -> upload (multipart, campo "file")
export const onRequestPost: PagesFunction<Env> = async ({ request, env, params }) => {
  const movimentoId = idOf(params)
  if (!(await getMovimentoById(env.DB, movimentoId))) {
    return errorJson('Movimento non trovato', 404)
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return errorJson('Upload non valido', 400)
  }
  const file = form.get('file')
  if (!(file instanceof File)) return errorJson('Nessun file ricevuto', 400)
  if (file.size === 0) return errorJson('Il file è vuoto', 400)
  if (file.size > MAX_SIZE) return errorJson('File troppo grande (massimo 10 MB)', 413)

  const id = crypto.randomUUID()
  const r2_key = `${movimentoId}/${id}`
  await env.DOCS.put(r2_key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  })

  const allegato: Allegato = {
    id,
    movimento_id: movimentoId,
    filename: file.name || 'documento',
    content_type: file.type || null,
    size: file.size,
    r2_key,
    created_at: Date.now(),
  }
  await insertAllegato(env.DB, allegato)
  return json({ allegato: meta(allegato) }, 201)
}
