import RecordsManager from '../components/RecordsManager'

const MovimentiPage = () => (
  <RecordsManager
    title="Movimenti"
    subtitle="Tutte le voci dell'archivio: pagamenti, fatture, ritenute, preventivi"
    newLabel="Nuovo movimento"
    defaultTipo="fattura_emessa"
    showTipoColumn
    showFilters
    filterShowTipo
  />
)

export default MovimentiPage
