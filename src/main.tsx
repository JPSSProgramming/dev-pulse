import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { AppStateProvider } from './context/AppStateContext'
import { I18nProvider } from './i18n/I18nProvider'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <AppStateProvider>
        <RouterProvider router={router} />
      </AppStateProvider>
    </I18nProvider>
  </StrictMode>,
)
