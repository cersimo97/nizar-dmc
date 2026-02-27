import { addDays, isAfter, subDays } from 'date-fns'

export function fillBlocks(
  start: Date,
  end: Date,
  arr: { start: Date; end: Date; hide?: boolean }[],
  direction: 'left' | 'right' = 'right'
): { start: Date; end: Date; hide?: boolean }[] {
  if (isAfter(start, end)) return []
  if (arr.length === 0) return [{ start, end, hide: true }]
  if (direction === 'left') {
    const item = arr[arr.length - 1]
    return [
      ...fillBlocks(
        start,
        subDays(item.start, 1),
        arr.slice(0, arr.length - 1),
        'left'
      ),
      item,
      ...fillBlocks(addDays(item.end, 1), end, [], 'right'),
    ]
  } else {
    const item = arr[0]
    return [
      ...fillBlocks(start, subDays(item.start, 1), [], 'left'),
      item,
      ...fillBlocks(
        addDays(item.end, 1),
        end,
        arr.slice(1, arr.length),
        'right'
      ),
    ]
  }
}

export const formatter = (d: Date) => Intl.DateTimeFormat('it-IT').format(d)
