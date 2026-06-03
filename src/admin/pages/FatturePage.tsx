import { useState } from 'react'
import RecordsManager from '../components/RecordsManager'

type Tab = 'emesse' | 'ricevute'

const FatturePage = () => {
  const [tab, setTab] = useState<Tab>('emesse')

  const tabBtn = (value: Tab) =>
    `rounded-full px-5 py-2 text-sm font-bold transition-colors ${
      tab === value ? 'bg-[#D03F29] text-white' : 'bg-white text-black hover:bg-black/5 border border-black/10'
    }`

  return (
    <div>
      <div className="mb-5 flex gap-2">
        <button onClick={() => setTab('emesse')} className={tabBtn('emesse')}>
          Emesse
        </button>
        <button onClick={() => setTab('ricevute')} className={tabBtn('ricevute')}>
          Ricevute
        </button>
      </div>

      {tab === 'emesse' ? (
        <RecordsManager
          key="emesse"
          title="Fatture emesse"
          subtitle="Fatture verso i clienti (da fare → emessa → pagata)"
          newLabel="Nuova fattura"
          defaultTipo="fattura_emessa"
          baseFilter={{ tipo: 'fattura_emessa' }}
          lockTipo
          filterShowTipo={false}
        />
      ) : (
        <RecordsManager
          key="ricevute"
          title="Fatture ricevute"
          subtitle="Fatture dei fornitori / spese (da pagare → pagata)"
          newLabel="Nuova fattura ricevuta"
          defaultTipo="fattura_ricevuta"
          baseFilter={{ tipo: 'fattura_ricevuta' }}
          lockTipo
          filterShowTipo={false}
        />
      )}
    </div>
  )
}

export default FatturePage
