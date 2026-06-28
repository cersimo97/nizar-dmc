import { Center, Loader } from '@mantine/core'
import useAuth from './useAuth'
import { Outlet, useNavigate } from 'react-router'

export default function ProtectedRoute() {
  const { loading, user } = useAuth()
  const navigate = useNavigate()

  if (loading)
    return (
      <Center>
        <Loader color="blue" size="lg" />
      </Center>
    )

  if (!user) {
    navigate('/login', {
      replace: true,
    })
  }

  return <Outlet />
}
