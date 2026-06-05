import {
  CalendarClock,
  Clock,
  Download,
  FileSignature,
  Receipt,
  Repeat,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { api } from '../api'
import { useFetch } from '../useFetch'
import { formatData, formatEuro } from '../format'
import { Movimento, RICORRENZA_LABEL, Summary, TIPO_LABEL } from '../types'
import KpiCard from '../components/KpiCard'
import SogliaOccasionale from '../components/SogliaOccasionale'
import MonthlyChart from '../components/MonthlyChart'
import DataTable, { Column } from '../components/DataTable'
import StatoBadge from '../components/StatoBadge'
import Loader from '../components/Loader'

const recentColumns: Column<Movimento>[] = [
  { key: 'data', header: 'Data', render: (m) => formatData(m.data) },
  { key: 'tipo', header: 'Tipo', render: (m) => TIPO_LABEL[m.tipo] },
  { key: 'controparte', header: 'Controparte', render: (m) => m.controparte || '—' },
  { key: 'netto', header: 'Netto', align: 'right', render: (m) => formatEuro(m.netto_cents) },
  { key: 'stato', header: 'Stato', render: (m) => <StatoBadge stato={m.stato} /> },
]

const PanoramicaPage = () => {
  const { data: summary, loading, error } = useFetch<Summary>(() => api.summary(), [])
  const { data: recent } = useFetch<Movimento[]>(() => api.listRecords({ gruppo: 'movimenti', limit: 8 }), [])

  if (loading) return <Loader />
  if (error) return <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-[#D03F29]">{error}</div>
  if (!summary) return null

  const { kpi, conteggi } = summary
  const saldoAccent = kpi.saldo >= 0 ? 'green' : 'red'

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black md:text-3xl">Panoramica</h1>
          <p className="mt-1 text-sm text-black/50">Quadro economico del tuo business</p>
        </div>
        <div className="flex gap-2">
          <a
            href={api.exportUrl('csv')}
            className="flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-bold hover:bg-black/5"
          >
            <Download size={16} />
            CSV
          </a>
          <a
            href={api.exportUrl('json')}
            className="flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-bold hover:bg-black/5"
          >
            <Download size={16} />
            Backup JSON
          </a>
        </div>
      </div>

      <div className="mb-6">
        <SogliaOccasionale kpi={kpi} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Saldo" value={formatEuro(kpi.saldo)} sub="Incassato − spese pagate" icon={Wallet} accent={saldoAccent} delay={0} />
        <KpiCard label="Incassato" value={formatEuro(kpi.incassato)} sub="Netto realmente incassato" icon={TrendingUp} accent="green" delay={0.05} />
        <KpiCard label="Da incassare" value={formatEuro(kpi.daIncassare)} sub={`${conteggi.compensiDaIncassare} compensi · ${conteggi.fattureEmesse} fatture emesse`} icon={Clock} accent="yellow" delay={0.1} />
        <KpiCard label="Spese pagate" value={formatEuro(kpi.spesePagate)} sub={`Da pagare: ${formatEuro(kpi.speseDaPagare)}`} icon={TrendingDown} accent="red" delay={0.15} />
        <KpiCard label="Ritenuta d'acconto" value={formatEuro(kpi.ritenuteAnno)} sub={`Acconto IRPEF trattenuto dai committenti · ${kpi.annoFiscale}`} icon={Receipt} accent="plain" delay={0.2} />
        <KpiCard label="Preventivi in corso" value={formatEuro(kpi.pipelinePreventivi)} sub={`${conteggi.preventiviAperti} preventivi aperti`} icon={FileSignature} accent="dark" delay={0.25} />
        <KpiCard label="Ricavi ricorrenti / anno" value={formatEuro(kpi.entrateRicorrentiAnnue)} sub="Canoni e rinnovi attivi" icon={Repeat} accent="green" delay={0.3} />
        <KpiCard label="Costi ricorrenti / anno" value={formatEuro(kpi.usciteRicorrentiAnnue)} sub="Abbonamenti e servizi" icon={Repeat} accent="plain" delay={0.35} />
      </div>

      <div className="mt-6">
        <MonthlyChart data={summary.serieMensile} />
      </div>

      {summary.prossimiRinnovi.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 font-black">Prossimi rinnovi</h2>
          <div className="divide-y divide-black/5 rounded-2xl border border-black/10 bg-white shadow-sm">
            {summary.prossimiRinnovi.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                <CalendarClock size={16} className="shrink-0 text-sky-600" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{r.controparte || '—'}</div>
                  <div className="truncate text-xs text-black/50">
                    {[r.descrizione, RICORRENZA_LABEL[r.ricorrenza] || r.ricorrenza].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-medium">{formatData(r.prossimo_rinnovo)}</div>
                  <div className="text-xs text-black/50">{formatEuro(r.imponibile_cents || r.totale_cents)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="mb-3 font-black">Movimenti recenti</h2>
        <DataTable
          columns={recentColumns}
          rows={recent || []}
          rowKey={(m) => m.id}
          emptyMessage="Ancora nessun movimento. Inizia aggiungendo fatture, preventivi o ritenute."
        />
      </div>

      <p className="mt-6 text-xs text-black/40">
        Compensi netti incassati {kpi.annoFiscale}: {formatEuro(kpi.compensiNettiAnno)} · Da incassare:{' '}
        {conteggi.compensiDaIncassare}
      </p>
    </div>
  )
}

export default PanoramicaPage
