import RecordsManager from '../components/RecordsManager'

const RitenutePage = () => (
  <RecordsManager
    title="Ritenute d'acconto"
    subtitle="Ritenute subìte sulle fatture (credito d'imposta), collegabili alla fattura"
    newLabel="Nuova ritenuta"
    defaultTipo="ritenuta"
    baseFilter={{ tipo: 'ritenuta' }}
    lockTipo
    filterShowTipo={false}
    loadFattureForLink
  />
)

export default RitenutePage
