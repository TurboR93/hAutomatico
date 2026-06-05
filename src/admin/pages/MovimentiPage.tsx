import RecordsManager from '../components/RecordsManager'
import { MOVIMENTO_TIPI } from '../types'

const MovimentiPage = () => (
  <RecordsManager
    title="Movimenti"
    subtitle="Transazioni: pagamenti, fatture emesse/ricevute, ritenute (i preventivi sono nella loro sezione)"
    newLabel="Nuovo movimento"
    defaultTipo="fattura_emessa"
    gruppo="movimenti"
    tipiOptions={MOVIMENTO_TIPI}
    showTipoColumn
    showFilters
    filterShowTipo
  />
)

export default MovimentiPage
