import {
  addDays,
  eachDayOfInterval,
  formatDate,
  isAfter,
  isBefore,
  isSameDay,
  subDays,
} from 'date-fns'
import type { Tour } from './types/Tour'
import { Box, Divider, Group, List, Stack, Text, Title } from '@mantine/core'
import Block from './Block'
import { colord, extend, random } from 'colord'
import a11yPlugin from 'colord/plugins/a11y'

extend([a11yPlugin])

const formatter = (d: Date) => Intl.DateTimeFormat('it-IT').format(d)
const UNIT_WIDTH = 20

function fillBlocks(
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

interface Props {
  data: Tour[]
}

function PlanningView({ data }: Props) {
  if (data.length === 0) return

  const minDate = data
    .map(t => t.startDate)
    .reduce((prev, curr) => (isBefore(curr, prev) ? curr : prev))
  const maxDate = data
    .map(t => t.endDate)
    .reduce((prev, curr) => (isAfter(curr, prev) ? curr : prev))

  const dateRange = eachDayOfInterval({ start: minDate, end: maxDate })

  const totalBuses =
    data
      .map(t => t.assignedBus!)
      .reduce((prev, curr) => (curr > prev ? curr : prev)) + 1
  const busPlans = Array.from({ length: totalBuses }).map((_, b) => {
    let c = random()
    while (c.brightness() < 0.7 || !colord('black').isReadable(c)) {
      c = c.lighten().desaturate()
    }
    return {
      color: c,
      tours: data
        .filter(t => t.assignedBus === b)
        .map(t => ({ start: t.startDate, end: t.endDate })),
    }
  })
  const busPlansFilled = busPlans.map(bp => ({
    color: bp.color,
    tours: fillBlocks(minDate, maxDate, bp.tours, 'right'),
  }))

  return (
    <>
      <Group justify="space-between">
        <div>
          <Text size="xs" mb={0} c="dimmed">
            Data inizio:
          </Text>
          <Text size="lg" fw="bold">
            {formatter(minDate)}
          </Text>
        </div>
        <Divider orientation="vertical" />
        <div style={{ textAlign: 'right' }}>
          <Text size="xs" mb={0} c="dimmed">
            Data fine:
          </Text>
          <Text size="lg" fw="bold">
            {formatter(maxDate)}
          </Text>
        </div>
      </Group>
      <Group align="stretch" gap="xs" grow>
        {busPlans.map((bp, i) => (
          <Stack key={i} bg={bp.color.toHex()} bdrs="md" p="md" gap="xs">
            <Title
              order={3}
              size="h2"
              c={bp.color.darken(0.4).toHex()}
              ta="center"
            >
              BUS #{i + 1}
            </Title>
            <List
              listStyleType="none"
              ml={0}
              p={2}
              bdrs="md"
              ta="center"
              bg={bp.color.lighten().toHex()}
            >
              {bp.tours.map((t, k) => (
                <List.Item key={k}>
                  {formatter(t.start)} → {formatter(t.end)}
                </List.Item>
              ))}
            </List>
          </Stack>
        ))}
      </Group>
      <div
        style={{
          overflowX: 'scroll',
          maxWidth: '100%',
          minWidth: 0,
          margin: '2rem auto',
        }}
      >
        <Group align="center" wrap="nowrap" gap={0}>
          {dateRange.map((d, i) => (
            <Box
              key={i}
              flex="0 0 auto"
              w={`${UNIT_WIDTH}px`}
              style={{ borderRight: '1px dotted rgba(0,0,0,.4)' }}
            >
              <Text size="xs" c="dimmed" ta="center" fz={10} mb="-.2rem">
                {formatDate(d, 'LLL')}
              </Text>
              <Text fw="bold" ta="center" mb={0} fz={12}>
                {d.getDate()}
              </Text>
            </Box>
          ))}
        </Group>
        {busPlansFilled.map((bp, ibp) => {
          return (
            <Group key={ibp} wrap="nowrap" mt={2} gap={0}>
              {bp.tours.map((t, i, arr) => (
                <Block
                  key={i}
                  startCommonDay={
                    arr[i - 1] && isSameDay(t.start, arr[i - 1].end)
                  }
                  endCommonDay={
                    arr[i + 1] && isSameDay(t.end, arr[i + 1].start)
                  }
                  {...t}
                  color={bp.color}
                  uw={UNIT_WIDTH}
                />
              ))}
            </Group>
          )
        })}
      </div>
    </>
  )
}

export default PlanningView
