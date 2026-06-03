import {
  Clock,
  Download,
  FileSignature,
  Receipt,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { api } from '../api'
import { useFetch } from '../useFetch'
import { formatData, formatEuro } from '../format'
import { Movimento, STATO_LABEL, Summary, TIPO_LABEL } from '../types'
import KpiCard from '../components/KpiCard'
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
  const { data: recent } = useFetch<Movimento[]>(() => api.listRecords({ limit: 8 }), [])

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Saldo" value={formatEuro(kpi.saldo)} sub="Incassato − spese pagate" icon={Wallet} accent={saldoAccent} delay={0} />
        <KpiCard label="Incassato" value={formatEuro(kpi.incassato)} sub="Netto realmente incassato" icon={TrendingUp} accent="green" delay={0.05} />
        <KpiCard label="Da incassare" value={formatEuro(kpi.daIncassare)} sub={`${conteggi.fattureEmesse} fatture emesse · ${conteggi.fattureDaFare} da fare`} icon={Clock} accent="yellow" delay={0.1} />
        <KpiCard label="Spese pagate" value={formatEuro(kpi.spesePagate)} sub={`Da pagare: ${formatEuro(kpi.speseDaPagare)}`} icon={TrendingDown} accent="red" delay={0.15} />
        <KpiCard label="Ritenute d'acconto" value={formatEuro(kpi.ritenuteSubite)} sub="Credito / acconto IRPEF subìto" icon={Receipt} accent="plain" delay={0.2} />
        <KpiCard label="Preventivi in corso" value={formatEuro(kpi.pipelinePreventivi)} sub={`${conteggi.preventiviAperti} preventivi aperti`} icon={FileSignature} accent="dark" delay={0.25} />
      </div>

      <div className="mt-6">
        <MonthlyChart data={summary.serieMensile} />
      </div>

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
        Fatturato totale (imponibile): {formatEuro(kpi.fatturato)} · {STATO_LABEL.da_versare} ritenute:{' '}
        {conteggi.ritenuteDaVersare}
      </p>
    </div>
  )
}

export default PanoramicaPage
