import type { Tour } from '../types/Tour'

export const input: Tour[] = [
  {
    startDate: new Date(2026, 2, 6),
    endDate: new Date(2026, 2, 15),
    numPar: 10,
  },
  {
    startDate: new Date(2026, 2, 12),
    endDate: new Date(2026, 2, 21),
    numPar: 9,
  },
  {
    startDate: new Date(2026, 2, 15),
    endDate: new Date(2026, 2, 24),
    numPar: 9,
  },
  {
    startDate: new Date(2026, 2, 20),
    endDate: new Date(2026, 2, 29),
    numPar: 10,
  },
  {
    startDate: new Date(2026, 2, 26),
    endDate: new Date(2026, 3, 4),
    numPar: 10,
  },
  {
    startDate: new Date(2026, 2, 29),
    endDate: new Date(2026, 3, 7),
    numPar: 10,
  },
  {
    startDate: new Date(2026, 3, 5),
    endDate: new Date(2026, 3, 14),
    numPar: 15,
  },
  {
    startDate: new Date(2026, 3, 10),
    endDate: new Date(2026, 3, 19),
    numPar: 15,
  },
  {
    startDate: new Date(2026, 3, 23),
    endDate: new Date(2026, 4, 2),
    numPar: 15,
  },
  {
    startDate: new Date(2026, 3, 28),
    endDate: new Date(2026, 4, 7),
    numPar: 15,
  },
  {
    startDate: new Date(2026, 4, 1),
    endDate: new Date(2026, 4, 10),
    numPar: 15,
  },
  {
    startDate: new Date(2026, 4, 3),
    endDate: new Date(2026, 4, 12),
    numPar: 15,
  },
  {
    startDate: new Date(2026, 4, 17),
    endDate: new Date(2026, 4, 26),
    numPar: 15,
  },
  {
    startDate: new Date(2026, 4, 22),
    endDate: new Date(2026, 4, 31),
    numPar: 15,
  },
  {
    startDate: new Date(2026, 4, 24),
    endDate: new Date(2026, 5, 2),
    numPar: 15,
  },
  {
    startDate: new Date(2026, 4, 28),
    endDate: new Date(2026, 5, 6),
    numPar: 15,
  },
  {
    startDate: new Date(2026, 4, 31),
    endDate: new Date(2026, 5, 9),
    numPar: 15,
  },
]

export const expectedOutput: Tour[] = [
  {
    startDate: new Date(2026, 2, 6),
    endDate: new Date(2026, 2, 15),
    numPar: 10,
    assignedBus: 0,
  },
  {
    startDate: new Date(2026, 2, 12),
    endDate: new Date(2026, 2, 21),
    numPar: 9,
    assignedBus: 1,
  },
  {
    startDate: new Date(2026, 2, 15),
    endDate: new Date(2026, 2, 24),
    numPar: 9,
    assignedBus: 0,
  },
  {
    startDate: new Date(2026, 2, 20),
    endDate: new Date(2026, 2, 29),
    numPar: 10,
    assignedBus: 1,
  },
  {
    startDate: new Date(2026, 2, 26),
    endDate: new Date(2026, 3, 4),
    numPar: 10,
    assignedBus: 0,
  },
  {
    startDate: new Date(2026, 2, 29),
    endDate: new Date(2026, 3, 7),
    numPar: 10,
    assignedBus: 1,
  },
  {
    startDate: new Date(2026, 3, 5),
    endDate: new Date(2026, 3, 14),
    numPar: 15,
    assignedBus: 0,
  },
  {
    startDate: new Date(2026, 3, 10),
    endDate: new Date(2026, 3, 19),
    numPar: 15,
    assignedBus: 1,
  },
  {
    startDate: new Date(2026, 3, 23),
    endDate: new Date(2026, 4, 2),
    numPar: 15,
    assignedBus: 0,
  },
  {
    startDate: new Date(2026, 3, 28),
    endDate: new Date(2026, 4, 7),
    numPar: 15,
    assignedBus: 1,
  },
  {
    startDate: new Date(2026, 4, 1),
    endDate: new Date(2026, 4, 10),
    numPar: 15,
    assignedBus: 0,
  },
  {
    startDate: new Date(2026, 4, 3),
    endDate: new Date(2026, 4, 12),
    numPar: 15,
    assignedBus: 2,
  },
  {
    startDate: new Date(2026, 4, 17),
    endDate: new Date(2026, 4, 26),
    numPar: 15,
    assignedBus: 0,
  },
  {
    startDate: new Date(2026, 4, 22),
    endDate: new Date(2026, 4, 31),
    numPar: 15,
    assignedBus: 1,
  },
  {
    startDate: new Date(2026, 4, 24),
    endDate: new Date(2026, 5, 2),
    numPar: 15,
    assignedBus: 2,
  },
  {
    startDate: new Date(2026, 4, 28),
    endDate: new Date(2026, 5, 6),
    numPar: 15,
    assignedBus: 0,
  },
  {
    startDate: new Date(2026, 4, 31),
    endDate: new Date(2026, 5, 9),
    numPar: 15,
    assignedBus: 2,
  },
]

export const input_2: Tour[] = [
  {
    startDate: new Date(2020, 0, 1),
    endDate: new Date(2020, 0, 11),
    numPar: 15,
  },
  {
    startDate: new Date(2020, 0, 13),
    endDate: new Date(2020, 0, 23),
    numPar: 15,
  },
  {
    startDate: new Date(2020, 0, 18),
    endDate: new Date(2020, 0, 28),
    numPar: 13,
  },
]

export const output_2: Tour[] = [
  {
    startDate: new Date(2020, 0, 2),
    endDate: new Date(2020, 0, 10),
    numPar: 15,
    assignedBus: 0,
  },
  {
    startDate: new Date(2020, 0, 14),
    endDate: new Date(2020, 0, 22),
    numPar: 15,
    assignedBus: 0,
  },
  {
    startDate: new Date(2020, 0, 19),
    endDate: new Date(2020, 0, 27),
    numPar: 13,
    assignedBus: 1,
  },
]
