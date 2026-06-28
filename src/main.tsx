import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import 'dayjs/locale/it'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { DatesProvider } from '@mantine/dates'
import { Notifications } from '@mantine/notifications'
import App from './App.tsx'
import AuthProvider from './auth/AuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <DatesProvider settings={{ locale: 'it' }}>
        <ModalsProvider>
          <Notifications />
          <AuthProvider>
            <App />
          </AuthProvider>
        </ModalsProvider>
      </DatesProvider>
    </MantineProvider>
  </StrictMode>
)
