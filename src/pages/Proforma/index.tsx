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
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DatePickerInput } from '@mantine/dates'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
  IconCurrencyEuro,
  IconFileTypePdf,
  IconInfoCircle,
} from '@tabler/icons-react'
import { pdf } from '@react-pdf/renderer'
import PDFProForma from './PDFProForma'
import { notifications } from '@mantine/notifications'
import { downloadFile } from '@/utils/download'
import { schema, type ProformaForm } from './proforma.schema'
import type { TourType } from '@/types/Tour'

export default function Proforma() {
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit } = useForm({
    defaultValues: {
      receiptDate: new Date(),
      startDate: new Date(),
      progressiveNumber: 1,
      tour: {
        type: 'standard' as TourType,
        amount: 10200,
        split: true,
      },
      includeSignature: false,
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

  const receiptCode = useMemo(
    () =>
      `${String(progressiveNumber).padStart(3, '0')}/${dayjs(startDate).year()}`,
    [startDate, progressiveNumber]
  )

  const onSubmit = async (data: ProformaForm) => {
    setLoading(true)

    try {
      const blob = await pdf(<PDFProForma data={data} />).toBlob()
      downloadFile(blob, `PROFORMA B2B72 ${receiptCode.replace('/', '-')}.pdf`)
    } catch (err) {
      console.error(err)
      notifications.show({
        title: 'Errore proforma',
        message: 'Non è stato possibile generare la fattura proforma',
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
      <Title order={2}>Genera fattura proforma</Title>

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
                  Il codice della fattura proforma sarà:{' '}
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
            <Controller
              control={control}
              name="tour.split"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  label="Dividi spesa (acconto e saldo)"
                />
              )}
            />
          </Grid.Col>
          <Grid.Col>
            <Controller
              control={control}
              name="includeSignature"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={field.onChange}
                  label="Includi timbro e firma"
                />
              )}
            />
          </Grid.Col>
          <Grid.Col>
            <Flex direction="row-reverse">
              <Button
                type="submit"
                leftSection={<IconFileTypePdf />}
                loading={loading}
              >
                Genera fattura proforma
              </Button>
            </Flex>
          </Grid.Col>
        </Grid>
      </form>
    </Box>
  )
}
