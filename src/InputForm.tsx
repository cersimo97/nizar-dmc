import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  isNumberLike,
  NumberInput,
  Text,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { createFormContext, formRootRule } from '@mantine/form'
import {
  IconAssembly,
  IconCalendar,
  IconGripVertical,
  IconTrash,
  IconUsers,
} from '@tabler/icons-react'
import { randomId } from '@mantine/hooks'
import { parse } from 'date-fns'
import type { Tour } from './types/Tour'

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
    <Group mt="xs">
      <Center w={20}>
        <IconGripVertical size={18} cursor="grab" />
      </Center>
      <DatePickerInput
        type="range"
        w={260}
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
      />
      <NumberInput
        min={0}
        maw={100}
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

function InputForm({ onCalculate }: { onCalculate: (tl: Tour[]) => void }) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      tours: [],
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
    onCalculate(tl)
  }

  const items = form
    .getValues()
    .tours.map((item, index) => <SortableItem key={item.key} index={index} />)

  return (
    <FormProvider form={form}>
      <form
        onSubmit={form.onSubmit(v => handleSubmit(v))}
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          minHeight: 0,
        }}
      >
        <Box
          id="scrollable"
          maw={800}
          px="sm"
          mih={0}
          mx="auto"
          flex={1}
          style={{ overflowY: 'auto' }}
        >
          {items.length > 0 ? (
            <Group>
              <Box w={20} h={10} display="inline-block" />
              <Text size="sm" fw={600} w={260}>
                Date viaggio
              </Text>
              <Text size="sm" fw={600} maw={100}>
                Partecipanti
              </Text>
            </Group>
          ) : (
            <Text c="dimmed" ta="center">
              Nessun viaggio trovato
            </Text>
          )}
          {items}
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
        <Group
          justify="space-between"
          align="center"
          p="md"
          style={{ flexShrink: 0 }}
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
        </Group>
      </form>
    </FormProvider>
  )
}

export default InputForm
