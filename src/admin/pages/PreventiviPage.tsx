import RecordsManager from '../components/RecordsManager'

const PreventiviPage = () => (
  <RecordsManager
    title="Preventivi"
    subtitle="Importo = incasso previsto (netto). Il residuo scala con gli incassi collegati."
    newLabel="Nuovo preventivo"
    defaultTipo="preventivo"
    baseFilter={{ tipo: 'preventivo' }}
    lockTipo
    filterShowTipo={false}
    variant="preventivi"
  />
)

export default PreventiviPage
