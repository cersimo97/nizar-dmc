import { addDays, compareAsc, differenceInDays, subDays } from 'date-fns'
import type { Tour } from '../types/Tour'

function updateBuses(
  buses: number[],
  currentDate: Date,
  nextDate: Date
): number[] {
  return buses.map(b => b - differenceInDays(nextDate, currentDate))
}

export function assignBuses(tourList: Tour[]): Tour[] {
  if (tourList.length === 0) throw new Error('Lista vuota!')

  // PRE-PROCESSING
  // Restrict date range and sort
  const tl: (Tour & { a: Date; z: Date })[] = tourList
    .map(t => ({
      ...t,
      a: addDays(t.startDate, 1),
      z: subDays(t.endDate, 1),
    }))
    .sort((a, b) => {
      const diff = compareAsc(a.a, b.a)
      if (diff === 0) return compareAsc(a.z, b.z)
      return diff
    })

  // CALCOLO ASSEGNAZIONE BUS
  tl[0].assignedBus = 0
  let buses = [differenceInDays(tl[0].z, tl[0].a)]
  let currentDate = tl[0].a
  let nextDate

  for (let i = 1; i < tl.length; i++) {
    nextDate = tl[i].a
    buses = updateBuses(buses, currentDate!, nextDate!)

    let k = 0
    let found = false
    while (k < buses.length && !found) {
      if (buses[k] <= 0) found = true
      k++
    }
    const duration = differenceInDays(tl[i].z, tl[i].a)

    if (found) {
      k -= 1
      tl[i].assignedBus = k
      buses[k] = duration
    } else {
      tl[i].assignedBus = buses.length
      buses.push(duration)
    }

    currentDate = nextDate
  }

  // POST-PROCESSING: CLEANING
  const finalTL: Tour[] = tl.map(t => ({
    startDate: t.a,
    endDate: t.z,
    numPar: t.numPar,
    assignedBus: t.assignedBus,
  }))

  return finalTL
}
