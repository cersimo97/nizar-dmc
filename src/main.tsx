import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import 'dayjs/locale/it'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import App from './App.tsx'
import { DatesProvider } from '@mantine/dates'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <DatesProvider settings={{ locale: 'it' }}>
        <ModalsProvider>
          <App />
        </ModalsProvider>
      </DatesProvider>
    </MantineProvider>
  </StrictMode>
)
