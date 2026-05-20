import {
  Alert,
  Box,
  Button,
  FileInput,
  Flex,
  Grid,
  NumberInput,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { Controller, useForm, useWatch } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { DatePickerInput } from '@mantine/dates'
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
  IconAlertTriangle,
  IconCurrencyEuro,
  IconFileTypePdf,
  IconInfoCircle,
} from '@tabler/icons-react'
import type { ReceiptFormValues, TourType } from './types'
import { pdf, PDFViewer } from '@react-pdf/renderer'
import PDFReceipt from './PDFReceipt'

const schema: yup.ObjectSchema<ReceiptFormValues> = yup.object().shape({
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

export default function Receipts() {
  const [imageFile, setImageFile] = useState<File | null>(null)

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ReceiptFormValues>({
    defaultValues: {
      receiptDate: new Date(),
      startDate: new Date(),
      progressiveNumber: 0,
      tour: {
        type: 'standard',
        amount: 10200,
      },
    },
    resolver: yupResolver(schema),
  })

  const formData = useWatch({
    control,
  })

  const startDate = useWatch({
    control,
    name: 'startDate',
  })

  const progressiveNumber = useWatch({
    control,
    name: 'progressiveNumber',
  })

  const receiptCode = useMemo(
    () =>
      `KK${dayjs(startDate).format('DDMMYY')}${String(progressiveNumber).padStart(3, '0')}`,
    [startDate, progressiveNumber]
  )

  const imageUrl = useMemo(() => {
    if (!imageFile) return null

    return URL.createObjectURL(imageFile)
  }, [imageFile])

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [imageUrl])

  const onSubmit = async (data: ReceiptFormValues) => {
    const receiptCode = `KK${dayjs(data.startDate).format('DDMMYY')}${String(data.progressiveNumber).padStart(3, '0')}`
    const blob = await pdf(
      <PDFReceipt data={data} imageUrl={imageUrl} />
    ).toBlob()
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `PROFORMA B2B72 ${receiptCode}.pdf`
    document.body.appendChild(a)

    a.click()

    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid>
              <Grid.Col>
                <FileInput
                  label="File immagine"
                  description="L'immagine del logo che compare in alto nella fattura"
                  accept="image/jpeg,image/png"
                  value={imageFile}
                  onChange={f => setImageFile(f)}
                  clearable
                />
              </Grid.Col>
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
                      Il codice della fattura sarà:{' '}
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
                          label: 'Viaggio di gruppo: BIG TOUR',
                        },
                        {
                          value: 'surf',
                          label: 'Viaggio di gruppo: SURF & SOUND',
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
                <Flex direction="row-reverse">
                  <Button type="submit" leftSection={<IconFileTypePdf />}>
                    Genera fattura
                  </Button>
                </Flex>
              </Grid.Col>
            </Grid>
          </form>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          {isValid ? (
            <PDFViewer width="100%" height="100%">
              <PDFReceipt
                data={formData as ReceiptFormValues}
                imageUrl={imageUrl}
              />
            </PDFViewer>
          ) : (
            <Stack
              w="100%"
              h="100%"
              justify="center"
              align="center"
              bdrs="sm"
              bd="2px dashed red"
              gap="sm"
            >
              <IconAlertTriangle color="red" size={'4rem'} />
              <Text
                c="red"
                fz="xl"
                fw="bold"
                ta="center"
                style={{ lineHeight: '100%' }}
              >
                Form non valido
              </Text>
              <Text c="red" ta="center" fz="sm" style={{ lineHeight: '100%' }}>
                Impossibile produrre l'anteprima
              </Text>
            </Stack>
          )}
        </Grid.Col>
      </Grid>
    </Box>
  )
}
