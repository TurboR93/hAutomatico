import RecordsManager from '../components/RecordsManager'

const PreventiviPage = () => (
  <RecordsManager
    title="Preventivi"
    subtitle="Preventivi firmati e lavori in corso d'opera"
    newLabel="Nuovo preventivo"
    defaultTipo="preventivo"
    baseFilter={{ tipo: 'preventivo' }}
    lockTipo
    filterShowTipo={false}
  />
)

export default PreventiviPage
