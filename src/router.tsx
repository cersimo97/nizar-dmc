import { createBrowserRouter } from 'react-router'
import Layout from './Layout'
import Welcome from './pages/Welcome'
import BusInputForm from './pages/BusInputForm'
import PlanningView from './pages/PlanningView'
import loadResults from './loaders/loadResults'
import Vouchers from './pages/Vouchers'
import Proforma from './pages/Proforma'
import Invoice from './pages/Invoice'
import Login from './pages/auth/Login'
import ProtectedRoute from './auth/ProtectedRoute'
import Acompte from './pages/Acompte'

const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    Component: ProtectedRoute,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          { index: true, Component: Welcome, loader: loadResults },
          { path: 'input-form', Component: BusInputForm, loader: loadResults },
          {
            path: 'planning-view',
            Component: PlanningView,
            loader: loadResults,
          },
          { path: 'vouchers', Component: Vouchers },
          { path: 'proforma', Component: Proforma },
          { path: 'invoice', Component: Invoice },
          { path: 'acompte', Component: Acompte },
        ],
      },
    ],
  },
])

export default router
