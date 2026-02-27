import { ActionIcon, Container, Group, Title } from '@mantine/core'
import { IconHome } from '@tabler/icons-react'
import { Link, Outlet } from 'react-router'

function Layout() {
  return (
    <Container size="md" py="md">
      <Group justify="space-between" align="center" mb="lg">
        <Title>Assegnazione BUS</Title>
        <ActionIcon component={Link} to="/" title="Home" variant="transparent">
          <IconHome />
        </ActionIcon>
      </Group>
      <Outlet />
    </Container>
  )
}

export default Layout
