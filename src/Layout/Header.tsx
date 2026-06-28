import { Button, Flex, Group, Menu, Title } from '@mantine/core'
import {
  IconFileTypeXls,
  IconHome,
  IconReceipt,
  type IconProps,
} from '@tabler/icons-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import { Link } from 'react-router'

type MenuItemChild = {
  label: string
  Icon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
  url: string
}

type MenuItem =
  | {
      label: string
      Icon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
      url: string
    }
  | {
      label: string
      Icon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
      url?: undefined
      children: MenuItemChild[]
    }

const navMenuItems: MenuItem[] = [
  { label: 'Home', Icon: IconHome, url: '/' },
  { label: 'Vouchers', Icon: IconFileTypeXls, url: '/vouchers' },
  {
    label: 'Fatture',
    Icon: IconReceipt,
    children: [
      { label: 'Proforma', url: '/proforma' },
      { label: 'Fattura', url: '/invoice' },
    ],
  },
]

function Header() {
  return (
    <header>
      <Group justify="space-between" align="center" mb="lg">
        <Title>KYUN KYUN - DMC</Title>
        <Flex direction="row-reverse" align="center" gap="lg" component="nav">
          {navMenuItems.map(item => {
            const Icon = item.Icon
            if (item.url === undefined) {
              return (
                <Menu
                  withArrow
                  shadow="md"
                  width={100}
                  key={`menu-${item.label}`}
                >
                  <Menu.Target>
                    <Button
                      variant="subtle"
                      leftSection={Icon ? <Icon /> : null}
                    >
                      {item.label}
                    </Button>
                  </Menu.Target>

                  <Menu.Dropdown>
                    {item.children?.map((c, subIndex) => (
                      <Menu.Item
                        component={Link}
                        to={c.url}
                        key={`${item.label}-child-${c.url ?? c.label}-${subIndex}`}
                      >
                        {c.label}
                      </Menu.Item>
                    ))}
                  </Menu.Dropdown>
                </Menu>
              )
            } else {
              return (
                <Button
                  key={item.url}
                  variant="subtle"
                  leftSection={Icon ? <Icon /> : null}
                  component={Link}
                  to={item.url}
                >
                  {item.label}
                </Button>
              )
            }
          })}
        </Flex>
      </Group>
    </header>
  )
}

export default Header
