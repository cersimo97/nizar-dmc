import {
  ActionIcon,
  Alert,
  Button,
  Container,
  Flex,
  Group,
  List,
  ListItem,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { Link, useLoaderData, useNavigate } from 'react-router'
import loadResults from './loaders/loadResults'
import {
  IconArrowsShuffle,
  IconChartBar,
  IconChess,
  IconEdit,
  IconFileExport,
  IconGraph,
  IconPlus,
} from '@tabler/icons-react'
import { modals } from '@mantine/modals'

function Welcome() {
  const { results } = useLoaderData<typeof loadResults>()
  const navigate = useNavigate()
  const openModal = () =>
    modals.openConfirmModal({
      title: 'Attenzione',
      centered: true,
      children: (
        <Text size="sm">
          Creando un nuovo programma, sovrascriverai quello vecchio. Vuoi
          continuare?
        </Text>
      ),
      labels: { confirm: 'Continua', cancel: 'Annulla' },
      onConfirm: () => handleReset(),
    })

  function handleReset() {
    localStorage.removeItem('results')
    navigate('input-form')
  }

  return (
    <Container>
      <Text>Benvenuto Nizar!</Text>
      {results?.length > 0 && (
        <>
          <Text display="block" size="sm" c="dimmed">
            Hai un programma di viaggio salvato in locale
          </Text>
          <Stack align="center" gap="sm" my="md">
            <Group
              justify="space-between"
              w="100%"
              p="sm"
              bd="1px solid gray.3"
              bdrs="sm"
            >
              <Text flex={1} style={{ userSelect: 'none' }}>
                Programma di viaggio #1
              </Text>
              <Group>
                <ActionIcon
                  component={Link}
                  to="input-form"
                  variant="subtle"
                  title="Modifica"
                >
                  <IconEdit />
                </ActionIcon>
                <ActionIcon
                  component={Link}
                  to="planning-view"
                  variant="subtle"
                  title="Vedi resoconto"
                >
                  <IconGraph />
                </ActionIcon>
              </Group>
            </Group>
          </Stack>
        </>
      )}
      <Flex direction="row-reverse" mt="sm">
        <Button onClick={openModal} leftSection={<IconPlus />}>
          Nuovo programma
        </Button>
      </Flex>
      <Alert
        variant="light"
        color="blue"
        title="Roadmap"
        my="md"
        styles={{
          title: {
            fontSize: '2rem',
          },
        }}
      >
        <Text>
          Questo è un MVP, ma sono in programma degli aggiornamenti che
          arricchiranno la piattaforma con nuove funzionalità:
        </Text>
        <List
          my="sm"
          styles={{
            itemWrapper: {
              marginBottom: '1rem',
              alignItems: 'flex-start',
            },
          }}
        >
          <ListItem
            icon={
              <ThemeIcon variant="transparent">
                <IconArrowsShuffle />
              </ThemeIcon>
            }
          >
            <Text component="span" fw="bold">
              Gestione dei conflitti:
            </Text>{' '}
            per il momento se un viaggio termina lo stesso giorno in cui inizia
            il successivo viene automaticamente contato quel giorno come buono.
            In realtà, non è sempre così e dipende dall'orario in cui il gruppo
            precedente lascia la città e quello successiva giunge sul posto.
          </ListItem>
          <ListItem
            icon={
              <ThemeIcon variant="transparent">
                <IconChess />
              </ThemeIcon>
            }
          >
            <Text component="span" fw="bold">
              Strategie:
            </Text>{' '}
            al momento viene scelto il primo pullman libero disponibile, ma si
            potrebbe voler attuare una strategia di selezione diversa. Ad
            esempio, un'altra strategia potrebbe consistere nello scegliere il
            pullman che è fermo da più tempo (e quindi non necessariamente il
            primo).
          </ListItem>
          <ListItem
            icon={
              <ThemeIcon variant="transparent">
                <IconFileExport />
              </ThemeIcon>
            }
          >
            <Text component="span" fw="bold">
              Esportazione:
            </Text>{' '}
            rendere possibile l'esportazione delle tabelle di marcia in formato
            PDF, CSV, TXT e XLSX (quale preferisci?)
          </ListItem>
          <ListItem
            icon={
              <ThemeIcon variant="transparent">
                <IconChartBar />
              </ThemeIcon>
            }
          >
            <Text component="span" fw="bold">
              Frequenza persone:
            </Text>{' '}
            visualizzare nei risultati anche un grafico rappresentante il numero
            di persone in viaggio giorno per giorno. Utile per avere sott'occhio
            i picchi in cui ci sono tante persone in giro contemporaneamente.
          </ListItem>
        </List>
      </Alert>
    </Container>
  )
}

export default Welcome
