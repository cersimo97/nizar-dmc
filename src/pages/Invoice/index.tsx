import {
  Alert,
  Box,
  Button,
  Flex,
  Grid,
  NumberInput,
  Select,
  Text,
  Title,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import {
  IconCurrencyEuro,
  IconFileTypePdf,
  IconInfoCircle,
} from '@tabler/icons-react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import dayjs from 'dayjs'
import PDFInvoice from './PDFInvoice'
import { downloadFile } from '@/utils/download'
import { schema, type InvoiceForm } from './invoice.schema'
import type { TourType } from '@/types/Tour'

export default function Invoice() {
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit } = useForm({
    defaultValues: {
      receiptDate: new Date(),
      startDate: new Date(),
      progressiveNumber: 1,
      tour: {
        type: 'standard' as TourType,
        amount: 10200,
      },
    },
    resolver: zodResolver(schema),
  })

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
      `${String(progressiveNumber).padStart(3, '0')}/${dayjs(startDate as Date).year()}`,
    [startDate, progressiveNumber]
  )

  const onSubmit = async (
    data: InvoiceForm,
    event?: React.BaseSyntheticEvent
  ) => {
    setLoading(true)

    const native = event?.nativeEvent as SubmitEvent | undefined
    const submitter = native?.submitter
    const genType = submitter?.getAttribute('name') as 'signed' | 'blank'

    try {
      const blob = await pdf(
        <PDFInvoice data={data} includeSignature={genType === 'signed'} />
      ).toBlob()
      downloadFile(blob, `INVOICE B2B72 ${receiptCode.replace('/', '-')}.pdf`)
    } catch (err) {
      console.error(err)
      notifications.show({
        title: 'Errore fattura',
        message: 'Non è stato possibile generare la fattura',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

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
              name="receiptDate"
              render={({ field, fieldState: { error } }) => (
                <DatePickerInput
                  value={field.value as Date}
                  onChange={field.onChange}
                  label="Data fattura"
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
            <Controller
              control={control}
              name="startDate"
              render={({ field, fieldState: { error } }) => (
                <DatePickerInput
                  value={field.value as Date}
                  onChange={field.onChange}
                  label="Data inizio viaggio"
                  error={error?.message}
                  valueFormat="DD/MM/YYYY"
                />
              )}
            />
          </Grid.Col>
          <Grid.Col>
            {Number.isFinite(progressiveNumber) && !!startDate && (
              <Alert variant="light" color="blue" icon={<IconInfoCircle />}>
                <Text>
                  Il numero progressivo della fattura sarà:{' '}
                  <Text component="span" c="blue" ff="monospace" fw="bold">
                    {receiptCode}
                  </Text>
                </Text>
              </Alert>
            )}
          </Grid.Col>
          <Grid.Col span={8}>
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
          <Grid.Col span={4}>
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
          <Grid.Col>
            <Flex direction="row-reverse" gap="sm">
              <Button
                type="submit"
                name="signed"
                leftSection={<IconFileTypePdf />}
                loading={loading}
              >
                Genera fattura firmata
              </Button>
              <Button
                type="submit"
                name="blank"
                leftSection={<IconFileTypePdf />}
                loading={loading}
              >
                Genera fattura bianca
              </Button>
            </Flex>
          </Grid.Col>
        </Grid>
      </form>
    </Box>
  )
}
