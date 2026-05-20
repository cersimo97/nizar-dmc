import { Box, Container } from '@mantine/core'
import { Outlet } from 'react-router'
import Header from './Header'

function Layout() {
  return (
    <Container
      size="lg"
      py="sm"
      style={{
        height: '100vh',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        rowGap: 2,
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      <Header />
      <Box
        style={{
          minHeight: 0,
          minWidth: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Container>
  )
}

export default Layout
