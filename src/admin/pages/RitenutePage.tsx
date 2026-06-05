import RecordsManager from '../components/RecordsManager'

// Prestazione occasionale (privato senza P.IVA): compensi con ritenuta d'acconto.
// Inserisci il netto del bonifico, la ritenuta 20% si aggiunge sopra (lordo).
const RitenutePage = () => (
  <RecordsManager
    title="Compensi (ritenuta d'acconto)"
    subtitle="Prestazione occasionale: incassi il netto, la ritenuta 20% la versa il committente. Conta verso la soglia di 5.000 € lordi/anno."
    newLabel="Nuovo compenso"
    defaultTipo="ritenuta"
    baseFilter={{ tipo: 'ritenuta' }}
    lockTipo
    filterShowTipo={false}
  />
)

export default RitenutePage
