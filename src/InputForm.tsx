import {
  ActionIcon,
  Box,
  Button,
  Center,
  Flex,
  Group,
  isNumberLike,
  NumberInput,
  Stack,
  Text,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { createFormContext, formRootRule } from '@mantine/form'
import {
  IconAssembly,
  IconCalendar,
  IconTrash,
  IconUsers,
} from '@tabler/icons-react'
import { randomId } from '@mantine/hooks'
import { parse } from 'date-fns'
import type { Tour } from './types/Tour'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useLoaderData, useNavigate } from 'react-router'
import { assignBuses } from './lib/calc'
import loadResults from './loaders/loadResults'

type FormValue = {
  tours: {
    key: string
    startDate: Date | null
    endDate: Date | null
    numPar: number
  }[]
}

const [FormProvider, useFormContext, useForm] = createFormContext<FormValue>()

function SortableItem({ index }: { index: number }) {
  const form = useFormContext()

  return (
    <Group wrap="nowrap">
      <Center w={20}>
        <Text c="dimmed" size="xl" fw="bold" opacity={0.5}>
          {index + 1}
        </Text>
      </Center>
      <DatePickerInput
        type="range"
        leftSectionPointerEvents="none"
        leftSection={<IconCalendar size={18} stroke={1.5} />}
        value={[
          form.values.tours[index].startDate,
          form.values.tours[index].endDate,
        ]}
        valueFormat="DD/MM/YYYY"
        onChange={([start, end]) => {
          if (start)
            form.setFieldValue(
              `tours.${index}.startDate`,
              parse(start, 'yyyy-MM-dd', new Date())
            )
          if (end)
            form.setFieldValue(
              `tours.${index}.endDate`,
              parse(end, 'yyyy-MM-dd', new Date())
            )
        }}
        error={
          (form.errors?.[`tours.${index}.startDate`] ||
            form.errors?.[
              `tours.$
            {index}.endDate`
            ]) && (
            <>
              <Text c="red" size="xs">
                {form.errors?.[`tours.${index}.startDate`]}
              </Text>
              <Text c="red" size="xs">
                {form.errors?.[`tours.${index}.endDate`]}
              </Text>
            </>
          )
        }
        flex={1}
      />
      <NumberInput
        min={0}
        leftSectionPointerEvents="none"
        leftSection={<IconUsers size={18} stroke={1.5} />}
        key={form.key(`tours.${index}.numPar`)}
        {...form.getInputProps(`tours.${index}.numPar`)}
        error={
          form.errors?.[`tours.${index}.numPar`] && (
            <Text c="red" size="xs">
              {form.errors?.[`tours.${index}.numPar`]}
            </Text>
          )
        }
        maw={100}
      />
      <ActionIcon
        variant="subtle"
        aria-label="remove-item"
        color="red"
        title="Elimina"
        onClick={() => form.removeListItem('tours', index)}
      >
        <IconTrash size={18} stroke={1.5} />
      </ActionIcon>
    </Group>
  )
}

function InputForm() {
  const { results } = useLoaderData<typeof loadResults>()
  const navigate = useNavigate()
  const [parent] = useAutoAnimate()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      tours:
        results?.length > 0
          ? results.map(r => ({
              key: randomId(),
              startDate: r.startDate,
              endDate: r.endDate,
              numPar: r.numPar,
            }))
          : [],
    },
    validate: {
      tours: {
        [formRootRule]: value =>
          value.length ? null : 'Inserisci almeno un viaggio',
        startDate: value => (value ? null : 'Inserisci la data di partenza'),
        endDate: value => (value ? null : 'Inserisci la data di arrivo'),
        numPar: value =>
          isNumberLike(value)
            ? value <= 0
              ? 'Inserisci almeno un partecipante'
              : null
            : 'Inserisci il numero di partecipanti',
      },
    },
  })

  function handleSubmit(v: FormValue) {
    const tl = v.tours.map(t => t as Tour)
    const results = assignBuses(tl)
    localStorage.setItem('results', JSON.stringify(results))
    navigate('/planning-view')
  }

  const items = form.values.tours.map((item, index) => (
    <SortableItem key={item.key} index={index} />
  ))

  return (
    <FormProvider form={form}>
      <form onSubmit={form.onSubmit(v => handleSubmit(v))}>
        <Box id="scrollable" px="sm" mih={0} maw={600} mx="auto">
          {items.length > 0 ? (
            <Group wrap="nowrap">
              <Box w={20} h={10} display="inline-block" />
              <Text size="sm" fw={600} miw={200} flex={1}>
                Date viaggio
              </Text>
              <Text size="sm" fw={600} w={100}>
                Partecipanti
              </Text>
              <ActionIcon
                variant="subtle"
                aria-label="remove-item"
                style={{ visibility: 'hidden' }}
              >
                <IconTrash size={18} stroke={1.5} />
              </ActionIcon>
            </Group>
          ) : (
            <Text c="dimmed" ta="center">
              Nessun viaggio trovato
            </Text>
          )}
          <Stack gap="xs" mt="xs" ref={parent}>
            {items}
          </Stack>
          <Group justify="center" mt="md">
            <Button
              variant="white"
              type="button"
              onClick={() =>
                form.insertListItem('tours', {
                  startDate: null,
                  endDate: null,
                  numPar: 15,
                  key: randomId(),
                })
              }
            >
              Aggiungi viaggio
            </Button>
          </Group>
        </Box>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          p="md"
          gap="sm"
        >
          <Text
            c="red.8"
            fw="bold"
            p="sm"
            bdrs="md"
            bg="red.1"
            style={{ visibility: form.errors?.tours ? 'visible' : 'hidden' }}
          >
            ERRORE: {form.errors?.tours}
          </Text>
          <Button
            variant="gradient"
            type="submit"
            leftSection={<IconAssembly size={18} />}
          >
            Assegna BUS
          </Button>
        </Flex>
      </form>
    </FormProvider>
  )
}

export default InputForm
