import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export default function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) throw new Error('Missing Auth context')

  return ctx
}
