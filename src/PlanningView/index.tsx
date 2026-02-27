import {
  eachDayOfInterval,
  formatDate,
  isAfter,
  isBefore,
  isSameDay,
} from 'date-fns'
import {
  Alert,
  Box,
  Divider,
  Group,
  List,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import Block from '../Block'
import { colord, extend } from 'colord'
import a11yPlugin from 'colord/plugins/a11y'
import randomColor from 'randomcolor'
import { Link, useLoaderData } from 'react-router'
import { fillBlocks, formatter } from './lib'
import type loadResults from '../loaders/loadResults'
import { IconInfoCircle } from '@tabler/icons-react'

extend([a11yPlugin])

const UNIT_WIDTH = 20

function PlanningView() {
  const { results } = useLoaderData<typeof loadResults>()

  if (!results || results.length === 0) return

  const minDate = results
    .map(t => t.startDate)
    .reduce((prev, curr) => (isBefore(curr, prev) ? curr : prev))
  const maxDate = results
    .map(t => t.endDate)
    .reduce((prev, curr) => (isAfter(curr, prev) ? curr : prev))

  const dateRange = eachDayOfInterval({ start: minDate, end: maxDate })

  const totalBuses =
    results
      .map(t => t.assignedBus!)
      .reduce((prev, curr) => (curr > prev ? curr : prev)) + 1
  const colors = randomColor({
    format: 'hex',
    luminosity: 'light',
    count: totalBuses,
  })
  const busPlans = Array.from({ length: totalBuses }).map((_, b) => ({
    color: colord(colors[b]),
    tours: results
      .filter(t => t.assignedBus === b)
      .map(t => ({ start: t.startDate, end: t.endDate })),
  }))
  const busPlansFilled = busPlans.map(bp => ({
    color: colord(bp.color),
    tours: fillBlocks(minDate, maxDate, bp.tours, 'right'),
  }))

  return (
    <Stack gap="lg">
      <Link to="/input-form">← Torna indietro</Link>
      <Alert variant="light" color="blue" icon={<IconInfoCircle />}>
        Per ogni viaggio, la durata è stata calcolata a partire dal secondo
        giorno fino al penultimo.
      </Alert>
      <Paper withBorder p="lg" bg="gray.0">
        <Stack gap="sm">
          <Group justify="space-between">
            <div>
              <Text size="sm" mb={0} c="dimmed">
                Data inizio:
              </Text>
              <Text size="xl" fw="bold">
                {formatter(minDate)}
              </Text>
            </div>
            <Divider orientation="vertical" />
            <div style={{ textAlign: 'right' }}>
              <Text size="sm" mb={0} c="dimmed">
                Data fine:
              </Text>
              <Text size="xl" fw="bold">
                {formatter(maxDate)}
              </Text>
            </div>
          </Group>
          <Divider />
          <Text>N° bus necessari: {totalBuses}</Text>
        </Stack>
      </Paper>
      <Group
        align="stretch"
        gap="xs"
        grow
        wrap="nowrap"
        style={{ overflowX: 'auto' }}
      >
        {busPlans.map((bp, i) => (
          <Stack
            key={i}
            bg={bp.color.toHex()}
            bdrs="md"
            p="md"
            gap="xs"
            miw="fit-content"
          >
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
              px="sm"
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
          overflowX: 'auto',
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
    </Stack>
  )
}

export default PlanningView
