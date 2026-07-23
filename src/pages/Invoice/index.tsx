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
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import type { InvoiceFormValues } from './types'
import type { TourType } from '@/types/Tour'
import { useMemo, useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import dayjs from 'dayjs'
import PDFInvoice from './PDFInvoice'
import { downloadFile } from '@/utils/download'

const schema: yup.ObjectSchema<InvoiceFormValues> = yup.object().shape({
  receiptDate: yup.date().required('Inserisci la data della fattura'),
  startDate: yup.date().required('Inserisci la data di inizio viaggio'),
  progressiveNumber: yup
    .number()
    .required('Inserisci il numero progressivo della fattura')
    .min(0, 'Il numero progressivo non può essere negativo'),
  tour: yup.object().shape({
    type: yup
      .mixed<TourType>()
      .oneOf(['standard', 'surf'], 'Tipo di viaggio non riconosciuto')
      .required('Inserisci il tipo di viaggio'),
    amount: yup
      .number()
      .typeError('Il costo deve essere un numero')
      .required('Inserisci il costo del viaggio')
      .min(0, 'Il costo non può essere negativo'),
  }),
})

export default function Invoice() {
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit } = useForm<InvoiceFormValues>({
    defaultValues: {
      receiptDate: new Date(),
      startDate: new Date(),
      progressiveNumber: 1,
      tour: {
        type: 'standard',
        amount: 10200,
      },
    },
    resolver: yupResolver(schema),
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
      `${String(progressiveNumber).padStart(3, '0')}/${dayjs(startDate).year()}`,
    [startDate, progressiveNumber]
  )

  const onSubmit = async (
    data: InvoiceFormValues,
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
                  {...field}
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
                  {...field}
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
