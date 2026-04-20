import {
  Button,
  Flex,
  Grid,
  NumberInput,
  TextInput,
  Title,
} from '@mantine/core'
import { downloadBuffer, generateVoucher } from './lib'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import dayjs from 'dayjs'
import { DatePickerInput } from '@mantine/dates'
import TourLegForm from './TourLegForm'
import { schema, tourLegs, type FormValues } from './schema'
import { useMemo, useState } from 'react'

function Vouchers() {
  const [isGenerating, setIsGenerating] = useState(false)
  const initialValues: FormValues = useMemo(
    () => ({
      dates: {
        from: new Date(),
        to: dayjs().add(10, 'days').toDate(),
      },
      coupon: 'KYUNKYUN',
      numPax: 17,
      tourLeader: {
        name: 'Carlotta Nepote',
      },
      tour: tourLegs.map((leg, i) => ({
        ...leg,
        dates: {
          in: dayjs().add(i, 'd').toDate(),
          out: dayjs()
            .add(i + 1, 'd')
            .toDate(),
        },
        hotel: {
          ...leg.hotel,
          rooms: {
            qdp: 0,
            trp: 5,
            dbl: 0,
            sgl: 2,
          },
        },
      })),
    }),
    []
  )

  const form = useForm({
    initialValues,
    validate: zod4Resolver(schema),
  })

  const handleSubmit = async (data: FormValues) => {
    setIsGenerating(true)
    try {
      const buffer = await generateVoucher(data)
      downloadBuffer(buffer)
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  // Update check-ins/outs and endDate accordingly
  // when changing startDate
  form.watch('dates.from', ({ value }) => {
    const tl = form.getValues().tour.length
    let currentDate = value
    for (let i = 0; i < tl; i++) {
      form.setFieldValue(`tour.${i}.dates.in`, currentDate)
      currentDate = dayjs(currentDate).add(1, 'day').toDate()
      form.setFieldValue(`tour.${i}.dates.out`, currentDate)
    }
    form.setFieldValue('dates.to', currentDate)
  })

  return (
    <>
      <Title order={2} style={{ textAlign: 'center' }}>
        Genera voucher
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid
          style={{
            margin: '1rem auto',
            minWidth: 300,
            maxWidth: 600,
          }}
        >
          <Grid.Col span={6}>
            <DatePickerInput
              dropdownType="modal"
              label="Date di inizio"
              placeholder="Seleziona data di inizio"
              valueFormat="DD/MM/YYYY"
              {...form.getInputProps('dates.from')}
              onChange={d =>
                form.setFieldValue('dates.from', new Date(d as string))
              }
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DatePickerInput
              dropdownType="modal"
              label="Data di fine"
              placeholder="Seleziona data di fine"
              valueFormat="DD/MM/YYYY"
              {...form.getInputProps('dates.to')}
              onChange={d =>
                form.setFieldValue('dates.to', new Date(d as string))
              }
            />
          </Grid.Col>
          <Grid.Col span={9}>
            <TextInput
              label="Coupon"
              styles={{
                input: {
                  fontFamily: 'monospace',
                  letterSpacing: 2,
                },
              }}
              {...form.getInputProps('coupon')}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              label="N° partecipanti"
              {...form.getInputProps('numPax')}
            />
          </Grid.Col>
          <Grid.Col>
            <Title order={4}>Tour Leader</Title>
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Nome e cognome"
              {...form.getInputProps('tourLeader.name')}
            />
          </Grid.Col>
          <Grid.Col span={6} />
          <Grid.Col>
            <Title order={3}>Tappe</Title>
          </Grid.Col>
          {form.values.tour.map((_, index) => (
            <TourLegForm key={index} form={form} index={index} />
          ))}

          <Grid.Col>
            <Flex direction="row-reverse">
              <Button type="submit" variant="gradient" loading={isGenerating}>
                Genera voucher
              </Button>
            </Flex>
          </Grid.Col>
        </Grid>
      </form>
    </>
  )
}

export default Vouchers
