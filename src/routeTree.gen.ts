
import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as DailyGoalsRouteImport } from './routes/daily-goals'
import { Route as FocusPulseRouteImport } from './routes/focus-pulse'
import { Route as SnippetsVaultRouteImport } from './routes/snippets-vault'

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const DailyGoalsRoute = DailyGoalsRouteImport.update({
  id: '/daily-goals',
  path: '/daily-goals',
  getParentRoute: () => rootRouteImport,
} as any)
const FocusPulseRoute = FocusPulseRouteImport.update({
  id: '/focus-pulse',
  path: '/focus-pulse',
  getParentRoute: () => rootRouteImport,
} as any)
const SnippetsVaultRoute = SnippetsVaultRouteImport.update({
  id: '/snippets-vault',
  path: '/snippets-vault',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/daily-goals': typeof DailyGoalsRoute
  '/focus-pulse': typeof FocusPulseRoute
  '/snippets-vault': typeof SnippetsVaultRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/daily-goals': typeof DailyGoalsRoute
  '/focus-pulse': typeof FocusPulseRoute
  '/snippets-vault': typeof SnippetsVaultRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/daily-goals': typeof DailyGoalsRoute
  '/focus-pulse': typeof FocusPulseRoute
  '/snippets-vault': typeof SnippetsVaultRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/daily-goals' | '/focus-pulse' | '/snippets-vault'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/daily-goals' | '/focus-pulse' | '/snippets-vault'
  id: '__root__' | '/' | '/daily-goals' | '/focus-pulse' | '/snippets-vault'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  DailyGoalsRoute: typeof DailyGoalsRoute
  FocusPulseRoute: typeof FocusPulseRoute
  SnippetsVaultRoute: typeof SnippetsVaultRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/daily-goals': {
      id: '/daily-goals'
      path: '/daily-goals'
      fullPath: '/daily-goals'
      preLoaderRoute: typeof DailyGoalsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/focus-pulse': {
      id: '/focus-pulse'
      path: '/focus-pulse'
      fullPath: '/focus-pulse'
      preLoaderRoute: typeof FocusPulseRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/snippets-vault': {
      id: '/snippets-vault'
      path: '/snippets-vault'
      fullPath: '/snippets-vault'
      preLoaderRoute: typeof SnippetsVaultRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DailyGoalsRoute: DailyGoalsRoute,
  FocusPulseRoute: FocusPulseRoute,
  SnippetsVaultRoute: SnippetsVaultRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
