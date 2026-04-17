import { expect, it } from 'vitest'
import { assignBuses } from './calc'
import { input_2, output_2 } from './tours.example'

it('produces assigned buses list', () => {
  const result = assignBuses(input_2)
  expect(result).toStrictEqual(output_2)
})
