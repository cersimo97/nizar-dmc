import { Container } from '@mantine/core'
import { Outlet } from 'react-router'
import Header from './Header'

function Layout() {
  return (
    <Container size="md" py="md">
      <Header />
      <Outlet />
    </Container>
  )
}

export default Layout
