import {
  Center,
  Divider,
  Grid,
  Group,
  NumberInput,
  Progress,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import type { UseFormReturnType } from '@mantine/form'
import {
  IconAlertCircle,
  IconBuildingSkyscraper,
  IconCurrencyEuro,
  IconMapPin,
  IconUsers,
} from '@tabler/icons-react'
import React, { useMemo } from 'react'
import type { FormValues } from './schema'

type FormType = UseFormReturnType<FormValues>

type TourLegFormProps = {
  form: FormType
  index: number
}

const TourLegForm = React.memo(function TourLegForm({
  form,
  index,
}: TourLegFormProps) {
  const theme = useMantineTheme()

  const leg = form.values.tour[index]
  const numPax = form.getValues().numPax

  const r = leg.hotel.rooms
  const progressValue = useMemo(
    () => r.qdp * 4 + r.trp * 3 + r.dbl * 2 + r.sgl,
    [r]
  )
  const progress = useMemo(() => {
    if (!numPax) return 0
    return Math.min(100, (progressValue / numPax) * 100)
  }, [progressValue, numPax])
  const isCountOk = useMemo(
    () => progressValue >= numPax,
    [progressValue, numPax]
  )

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        currencyDisplay: 'code',
        minimumFractionDigits: 0,
      }),
    []
  )

  return (
    <>
      <Grid.Col>
        <TextInput
          variant="unstyled"
          description={`${index + 1}ª tappa`}
          styles={{
            input: {
              fontSize: '1.2rem',
              fontWeight: 'bold',
            },
          }}
          {...form.getInputProps(`tour.${index}.city`)}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <DatePickerInput
          dropdownType="modal"
          label="Check-in"
          valueFormat="DD/MM/YYYY"
          {...form.getInputProps(`tour.${index}.dates.in`)}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <DatePickerInput
          dropdownType="modal"
          label="Check-out"
          valueFormat="DD/MM/YYYY"
          {...form.getInputProps(`tour.${index}.dates.out`)}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <TextInput
          label="Nome hotel"
          leftSection={<IconBuildingSkyscraper size={18} />}
          {...form.getInputProps(`tour.${index}.hotel.name`)}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <TextInput
          label="Indirizzo hotel"
          leftSection={<IconMapPin size={18} />}
          {...form.getInputProps(`tour.${index}.hotel.address`)}
        />
      </Grid.Col>
      <Grid.Col mt="xs" />
      <Grid.Col span={6}>
        <Group align="center" gap={0}>
          {form.errors[`tour.${index}.hotel.rooms`] && (
            <IconAlertCircle color="red" size={18} style={{ marginRight: 4 }} />
          )}
          <Title
            order={5}
            textWrap="nowrap"
            c={form.errors[`tour.${index}.hotel.rooms`] ? 'red' : 'inherit'}
          >
            Distribuzione camere
          </Title>
        </Group>
      </Grid.Col>
      <Grid.Col span={1}>
        <Center h="100%">
          <IconUsers
            size={18}
            color={isCountOk ? theme.colors.green[7] : theme.colors.gray[7]}
          />
        </Center>
      </Grid.Col>
      <Grid.Col span={4} style={{ alignSelf: 'center' }}>
        <Progress color={isCountOk ? 'green' : 'blue'} value={progress} />
      </Grid.Col>
      <Grid.Col span={1} style={{ alignSelf: 'center' }}>
        <Text
          c={
            form.errors[`tour.${index}.hotel.rooms`]
              ? 'red'
              : isCountOk
                ? 'green'
                : 'dimmed'
          }
          fw={
            isCountOk || form.errors[`tour.${index}.hotel.rooms`]
              ? 'bold'
              : 'normal'
          }
          ta="center"
          size="sm"
          display="inline-block"
        >
          {progressValue}
        </Text>
      </Grid.Col>
      <Grid.Col span={3}>
        <NumberInput
          label={
            <>
              QDP{' '}
              <Text c="dimmed" size="xs" display="inline">
                (x4)
              </Text>
            </>
          }
          min={0}
          {...form.getInputProps(`tour.${index}.hotel.rooms.qdp`)}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <NumberInput
          label={
            <>
              TRP{' '}
              <Text c="dimmed" size="xs" display="inline">
                (x3)
              </Text>
            </>
          }
          min={0}
          {...form.getInputProps(`tour.${index}.hotel.rooms.trp`)}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <NumberInput
          label={
            <>
              DBL{' '}
              <Text c="dimmed" size="xs" display="inline">
                (x2)
              </Text>
            </>
          }
          min={0}
          {...form.getInputProps(`tour.${index}.hotel.rooms.dbl`)}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <NumberInput
          label={
            <>
              SGL{' '}
              <Text c="dimmed" size="xs" display="inline">
                (x1)
              </Text>
            </>
          }
          min={0}
          {...form.getInputProps(`tour.${index}.hotel.rooms.sgl`)}
        />
      </Grid.Col>
      <Grid.Col>
        <TextInput
          label="Trattamento"
          {...form.getInputProps(`tour.${index}.hotel.service`)}
        />
      </Grid.Col>
      <Grid.Col>
        <NumberInput
          label="Tassa di soggiorno"
          description={`Sul voucher risulterà: "Il comune applica una tassa di soggiorno: ${currencyFormatter.format(
            leg.hotel.touristTax
          )} a persona, a notte."`}
          min={0}
          leftSection={<IconCurrencyEuro size={18} />}
          {...form.getInputProps(`tour.${index}.hotel.touristTax`)}
        />
      </Grid.Col>
      <Grid.Col>
        <Divider mt="md" mb="sm" />
      </Grid.Col>
    </>
  )
})

export default TourLegForm
