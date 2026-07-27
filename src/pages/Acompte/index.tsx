import {
  Alert,
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  NumberInput,
  Select,
  Text,
  Title,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import {
  IconCurrencyEuro,
  IconFileTypePdf,
  IconInfoCircle,
  IconPercentage,
} from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schema, type AcompteForm } from './acompte.schema'
import dayjs from 'dayjs'
import { notifications } from '@mantine/notifications'
import { pdf } from '@react-pdf/renderer'
import PDFAcompte from './PDFAcompte'
import { downloadFile } from '@/utils/download'
import type { TourType } from '@/types/Tour'

export default function Acompte() {
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit } = useForm({
    defaultValues: {
      docDate: new Date(),
      startDate: new Date(),
      tour: {
        type: 'standard' as TourType,
        amount: 3060,
        percAvance: 30,
      },
      progressiveNumber: 0,
      includeSignature: false,
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: AcompteForm) => {
    setLoading(true)

    try {
      const blob = await pdf(<PDFAcompte data={data} />).toBlob()
      downloadFile(blob, `ACOMPTE ${receiptCode.replace('/', '-')}.pdf`)
    } catch (err) {
      console.error(err)
      notifications.show({
        title: 'Errore fattura',
        message: "Non è stato possibile generare la fattura d'acconto",
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  const startDate = useWatch({
    control,
    name: 'startDate',
  })

  const progressiveNumber = useWatch({
    control,
    name: 'progressiveNumber',
  })

  const receiptCode = useMemo<string>(
    () =>
      `${String(progressiveNumber).padStart(3, '0')}/${dayjs(startDate).year()}`,
    [startDate, progressiveNumber]
  )

  return (
    <Box
      component="section"
      style={{
        minHeight: 0,
        minWidth: 0,
        width: '100%',
      }}
    >
      <Title order={2}>Genera fattura</Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid>
          <Grid.Col span={8}>
            <Controller
              control={control}
              name="docDate"
              render={({ field, fieldState: { error } }) => (
                <DatePickerInput
                  {...field}
                  label="Data documento"
                  error={error?.message}
                  valueFormat="DD/MM/YYYY"
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Controller
              control={control}
              name="progressiveNumber"
              render={({ field, fieldState: { error } }) => (
                <NumberInput
                  {...field}
                  label="Numero progressivo"
                  error={error?.message}
                />
              )}
            />
          </Grid.Col>
          <Grid.Col>
            {Number.isFinite(progressiveNumber) && !!startDate && (
              <Alert variant="light" color="blue" icon={<IconInfoCircle />}>
                <Text>
                  Il numero progressivo del documento sarà:{' '}
                  <Text component="span" c="blue" ff="monospace" fw="bold">
                    {receiptCode}
                  </Text>
                </Text>
              </Alert>
            )}
          </Grid.Col>
          <Grid.Col>
            <Controller
              control={control}
              name="startDate"
              render={({ field, fieldState: { error } }) => (
                <DatePickerInput
                  {...field}
                  label="Data inizio viaggio"
                  error={error?.message}
                  valueFormat="DD/MM/YYYY"
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Controller
              control={control}
              name="tour.type"
              render={({ field, fieldState: { error } }) => (
                <Select
                  {...field}
                  label="Tipo di viaggio"
                  data={[
                    {
                      value: 'standard',
                      label: 'Tour group: BIG TOUR',
                    },
                    {
                      value: 'surf',
                      label: 'Tour group: SURF & SOUND',
                    },
                  ]}
                  error={error?.message}
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Controller
              control={control}
              name="tour.amount"
              render={({ field, fieldState: { error } }) => (
                <NumberInput
                  {...field}
                  label="Costo viaggio"
                  leftSection={<IconCurrencyEuro />}
                  min={0}
                  error={error?.message}
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <Controller
              control={control}
              name="tour.percAvance"
              render={({ field, fieldState: { error } }) => (
                <NumberInput
                  {...field}
                  label="Percentuale"
                  leftSection={<IconPercentage />}
                  min={0}
                  max={100}
                  error={error?.message}
                />
              )}
            />
          </Grid.Col>
          <Grid.Col>
            <Controller
              control={control}
              name="includeSignature"
              render={({ field, fieldState: { error } }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  label="Includi timbro e firma"
                  error={error?.message}
                />
              )}
            />
          </Grid.Col>
          <Grid.Col>
            <Flex direction="row-reverse" gap="sm">
              <Button
                type="submit"
                leftSection={<IconFileTypePdf />}
                loading={loading}
              >
                Genera fattura d'acconto
              </Button>
            </Flex>
          </Grid.Col>
        </Grid>
      </form>
    </Box>
  )
}
