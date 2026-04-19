import { Button, Flex, Group, Title } from '@mantine/core'
import { IconFileTypeXls, IconHome } from '@tabler/icons-react'
import { Link } from 'react-router'

const navMenuItems = [
  { label: 'Home', Icon: IconHome, url: '/' },
  { label: 'Vouchers', Icon: IconFileTypeXls, url: '/vouchers' },
]

function Header() {
  return (
    <header>
      <Group justify="space-between" align="center" mb="lg">
        <Title>KYUN KYUN - DMC</Title>
        <Flex direction="row-reverse" align="center" gap="lg" component="nav">
          {navMenuItems.map(({ label, Icon, url }) => (
            <Button
              key={url}
              variant="subtle"
              leftSection={<Icon />}
              component={Link}
              to={url}
            >
              {label}
            </Button>
          ))}
        </Flex>
      </Group>
    </header>
  )
}

export default Header
