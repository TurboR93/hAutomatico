import { json } from '../_shared/db'
import { Env } from '../_shared/types'

// GET /api/summary -> KPI della panoramica + serie mensile incassi/spese.
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  // Anno solare corrente: per i compensi occasionali conta la competenza dell'anno
  // (data incasso se presente, altrimenti data documento).
  const annoCompenso = "strftime('%Y', COALESCE(data_pagamento, data)) = strftime('%Y','now')"
  const kpiSql = `
    SELECT
      CAST(strftime('%Y','now') AS INTEGER) AS annoFiscale,
      COALESCE(SUM(CASE WHEN tipo='fattura_emessa' THEN imponibile_cents ELSE 0 END), 0) AS fatturato,
      COALESCE(SUM(CASE WHEN tipo='pagamento'
                          OR (tipo='fattura_emessa' AND stato='pagata')
                          OR (tipo='ritenuta' AND stato='incassato') THEN netto_cents ELSE 0 END), 0) AS incassato,
      COALESCE(SUM(CASE WHEN (tipo='fattura_emessa' AND stato<>'pagata')
                          OR (tipo='ritenuta' AND stato='da_incassare') THEN netto_cents ELSE 0 END), 0) AS daIncassare,
      COALESCE(SUM(CASE WHEN tipo IN ('fattura_ricevuta','spesa') THEN totale_cents ELSE 0 END), 0) AS spese,
      COALESCE(SUM(CASE WHEN tipo IN ('fattura_ricevuta','spesa') AND stato='pagata' THEN totale_cents ELSE 0 END), 0) AS spesePagate,
      COALESCE(SUM(CASE WHEN tipo IN ('fattura_ricevuta','spesa') AND stato<>'pagata' THEN totale_cents ELSE 0 END), 0) AS speseDaPagare,
      COALESCE(SUM(CASE WHEN tipo='ritenuta' AND ${annoCompenso} THEN imponibile_cents ELSE 0 END), 0) AS compensiLordiAnno,
      COALESCE(SUM(CASE WHEN tipo='ritenuta' AND ${annoCompenso} THEN netto_cents ELSE 0 END), 0) AS compensiNettiAnno,
      COALESCE(SUM(CASE WHEN tipo='ritenuta' AND ${annoCompenso} THEN ritenuta_cents ELSE 0 END), 0) AS ritenuteAnno,
      COALESCE(SUM(CASE WHEN tipo='preventivo' AND stato IN ('firmato','in_corso') THEN imponibile_cents ELSE 0 END), 0) AS pipelinePreventivi,
      COALESCE(SUM(CASE WHEN tipo='fattura_emessa' AND ricorrenza='mensile' THEN imponibile_cents*12
                        WHEN tipo='fattura_emessa' AND ricorrenza='annuale' THEN imponibile_cents
                        ELSE 0 END), 0) AS entrateRicorrentiAnnue,
      COALESCE(SUM(CASE WHEN tipo IN ('fattura_ricevuta','spesa') AND ricorrenza='mensile' THEN totale_cents*12
                        WHEN tipo IN ('fattura_ricevuta','spesa') AND ricorrenza='annuale' THEN totale_cents
                        ELSE 0 END), 0) AS usciteRicorrentiAnnue
    FROM movimenti
  `
  const countSql = `
    SELECT
      COALESCE(SUM(CASE WHEN tipo='fattura_emessa' AND stato='da_fare' THEN 1 ELSE 0 END), 0) AS fattureDaFare,
      COALESCE(SUM(CASE WHEN tipo='fattura_emessa' AND stato='emessa' THEN 1 ELSE 0 END), 0) AS fattureEmesse,
      COALESCE(SUM(CASE WHEN tipo='fattura_ricevuta' AND stato='da_pagare' THEN 1 ELSE 0 END), 0) AS fattureDaPagare,
      COALESCE(SUM(CASE WHEN tipo='preventivo' AND stato IN ('firmato','in_corso') THEN 1 ELSE 0 END), 0) AS preventiviAperti,
      COALESCE(SUM(CASE WHEN tipo='ritenuta' AND stato='da_incassare' THEN 1 ELSE 0 END), 0) AS compensiDaIncassare
    FROM movimenti
  `
  const serieSql = `
    SELECT
      substr(COALESCE(data_pagamento, data), 1, 7) AS mese,
      COALESCE(SUM(CASE WHEN tipo='pagamento'
                          OR (tipo='fattura_emessa' AND stato='pagata')
                          OR (tipo='ritenuta' AND stato='incassato') THEN netto_cents ELSE 0 END), 0) AS incassi,
      COALESCE(SUM(CASE WHEN tipo IN ('fattura_ricevuta','spesa') AND stato='pagata' THEN totale_cents ELSE 0 END), 0) AS spese
    FROM movimenti
    WHERE COALESCE(data_pagamento, data) IS NOT NULL
    GROUP BY mese
    ORDER BY mese
  `

  const rinnoviSql = `
    SELECT id, tipo, controparte, descrizione, ricorrenza, prossimo_rinnovo,
           imponibile_cents, totale_cents
    FROM movimenti
    WHERE ricorrenza IN ('mensile','annuale') AND prossimo_rinnovo IS NOT NULL
    ORDER BY prossimo_rinnovo ASC
    LIMIT 8
  `

  const [kpi, counts, serie, rinnovi] = await Promise.all([
    env.DB.prepare(kpiSql).first<Record<string, number>>(),
    env.DB.prepare(countSql).first<Record<string, number>>(),
    env.DB.prepare(serieSql).all<{ mese: string; incassi: number; spese: number }>(),
    env.DB.prepare(rinnoviSql).all(),
  ])

  const incassato = kpi?.incassato ?? 0
  const spesePagate = kpi?.spesePagate ?? 0

  return json({
    kpi: {
      fatturato: kpi?.fatturato ?? 0,
      incassato,
      daIncassare: kpi?.daIncassare ?? 0,
      spese: kpi?.spese ?? 0,
      spesePagate,
      speseDaPagare: kpi?.speseDaPagare ?? 0,
      saldo: incassato - spesePagate,
      pipelinePreventivi: kpi?.pipelinePreventivi ?? 0,
      entrateRicorrentiAnnue: kpi?.entrateRicorrentiAnnue ?? 0,
      usciteRicorrentiAnnue: kpi?.usciteRicorrentiAnnue ?? 0,
      annoFiscale: kpi?.annoFiscale ?? new Date().getUTCFullYear(),
      sogliaCompensi: 500000,
      compensiLordiAnno: kpi?.compensiLordiAnno ?? 0,
      compensiNettiAnno: kpi?.compensiNettiAnno ?? 0,
      ritenuteAnno: kpi?.ritenuteAnno ?? 0,
    },
    conteggi: counts ?? {},
    serieMensile: serie?.results ?? [],
    prossimiRinnovi: rinnovi?.results ?? [],
  })
}
