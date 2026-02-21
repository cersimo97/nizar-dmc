import { Container, Title } from '@mantine/core'
import { assignBuses } from './lib/calc'
import { useState } from 'react'
import type { Tour } from './types/Tour'
import PlanningView from './PlanningView'
import InputForm from './InputForm'

function App() {
  const [result, setResult] = useState<Tour[] | null>(null)

  function handleCalculate(v: Tour[]) {
    const res = assignBuses(v)
    setResult(res)
  }

  return (
    <Container
      size="md"
      py="md"
      h="100vh"
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      <Title mb="lg">Assegnazione BUS</Title>
      {result ? (
        <PlanningView data={result} />
      ) : (
        <InputForm onCalculate={handleCalculate} />
      )}
    </Container>
  )
}

export default App
