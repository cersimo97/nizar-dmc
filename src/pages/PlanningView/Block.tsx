import { Box, Popover, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { colord, type Colord } from 'colord'
import { differenceInDays } from 'date-fns'

const formatter = (d: Date) => Intl.DateTimeFormat('it-IT').format(d)

const UNIT_WIDTH = 20

interface Props {
  start: Date
  end: Date
  hide?: boolean | undefined
  // Does this tour start the same day the previous one ended?
  startCommonDay: boolean
  // Does this tour end the same day the next one starts?
  endCommonDay: boolean
  uw?: number
  color?: Colord
  key: number
}

function Block({
  start,
  end,
  hide,
  startCommonDay,
  endCommonDay,
  uw = UNIT_WIDTH,
  color = colord('blue'),
}: Props) {
  const [opened, { open, close }] = useDisclosure()

  // Calcolo dello spazio da sottrarre quando ci sono giorni
  // in comune tra tour adiacenti
  let difference
  if ((startCommonDay && !endCommonDay) || (!startCommonDay && endCommonDay))
    difference = 0.5
  else if (startCommonDay && endCommonDay) difference = 1
  else difference = 0

  const computedWidth = (differenceInDays(end, start) + 1 - difference) * uw

  return (
    <Popover withArrow opened={!hide && opened}>
      <Popover.Target>
        <Box
          flex="0 0 auto"
          w={`${computedWidth}px`}
          bg={hide ? 'transparent' : color.toHex()}
          h={20}
          bd={hide ? 'none' : '1px solid black'}
          onMouseEnter={open}
          onMouseLeave={close}
        />
      </Popover.Target>
      <Popover.Dropdown
        style={{ pointerEvents: 'none' }}
        bg={color.lighten().toHex()}
      >
        <Text size="sm">{formatter(start)}</Text>
        <Text size="sm">{formatter(end)}</Text>
      </Popover.Dropdown>
    </Popover>
  )
}

export default Block
