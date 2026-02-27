import type { Tour } from '../types/Tour'

function loadResults() {
  const results = localStorage.getItem('results')
  if (results) {
    const serializedResults: Tour[] = JSON.parse(results).map(
      (r: {
        key: string
        assignedBus: number
        numPar: number
        startDate: string
        endDate: string
      }) => ({
        ...r,
        startDate: new Date(r.startDate),
        endDate: new Date(r.endDate),
      })
    )
    return { results: serializedResults }
  }
  return { results: [] }
}

export default loadResults
