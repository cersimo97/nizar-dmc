import { describe, expect, it } from 'vitest'
import { assignBuses } from './calc'
import { input_2, output_2 } from './tours.example'

describe('Assign buses fn()', () => {
  it.skip('should produce a list of assigned buses', () => {
    const result = assignBuses(input_2)
    expect(result).toStrictEqual(output_2)
  })
})
