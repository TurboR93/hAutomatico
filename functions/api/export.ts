import { listMovimenti } from '../_shared/db'
import { Env } from '../_shared/types'

// GET /api/export?format=json|csv -> backup completo dei movimenti (download).
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const format = new URL(request.url).searchParams.get('format') === 'csv' ? 'csv' : 'json'
  const records = await listMovimenti(env.DB, {})
  const stamp = new Date().toISOString().slice(0, 10)

  if (format === 'json') {
    return new Response(JSON.stringify({ exported_at: new Date().toISOString(), records }, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="hautomatico-backup-${stamp}.json"`,
      },
    })
  }

  // CSV in formato italiano (separatore ';', decimali con virgola) per Excel IT.
  const euro = (c: number) => (Number(c || 0) / 100).toFixed(2).replace('.', ',')
  const cell = (v: unknown) => {
    const s = v === null || v === undefined ? '' : String(v)
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const headers = [
    'id', 'tipo', 'controparte', 'descrizione', 'numero', 'data', 'data_scadenza',
    'data_pagamento', 'imponibile', 'cassa_%', 'cassa', 'iva_%', 'iva', 'ritenuta_%',
    'ritenuta', 'totale', 'netto', 'stato', 'fattura_id', 'note',
  ]
  const lines = [headers.join(';')]
  for (const r of records) {
    lines.push([
      r.id, r.tipo, r.controparte, r.descrizione, r.numero, r.data, r.data_scadenza,
      r.data_pagamento, euro(r.imponibile_cents), r.cassa_percentuale, euro(r.cassa_cents),
      r.iva_percentuale, euro(r.iva_cents), r.ritenuta_percentuale, euro(r.ritenuta_cents),
      euro(r.totale_cents), euro(r.netto_cents), r.stato, r.fattura_id, r.note,
    ].map(cell).join(';'))
  }
  // BOM per far riconoscere a Excel la codifica UTF-8.
  return new Response('﻿' + lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="hautomatico-backup-${stamp}.csv"`,
    },
  })
}
