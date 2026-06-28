import useAuth from '@/auth/useAuth'
import {
  Button,
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from '@mantine/core'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'

export default function Login() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleSignIn = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    await login(email, password)
    navigate('/')
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center">Benvenuto!</Title>

      <Paper
        component="form"
        onSubmit={handleSignIn}
        withBorder
        shadow="sm"
        p={22}
        mt={30}
        radius="md"
      >
        <TextInput
          value={email}
          onChange={e => setEmail(e.target.value)}
          label="Email"
          placeholder="you@email.com"
          required
          radius="md"
          type="email"
          autoComplete="work email"
        />
        <PasswordInput
          value={password}
          onChange={e => setPassword(e.target.value)}
          label="Password"
          placeholder="La tua password"
          required
          mt="md"
          radius="md"
          autoComplete="new-password"
        />
        <Button type="submit" fullWidth mt="xl" radius="md" loading={loading}>
          Accedi
        </Button>
      </Paper>
    </Container>
  )
}
