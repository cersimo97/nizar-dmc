import { createBrowserRouter } from 'react-router'
import Layout from './Layout'
import Welcome from './Welcome'
import InputForm from './InputForm'
import PlanningView from './PlanningView'
import loadResults from './loaders/loadResults'
import Vouchers from './Vouchers'
import Proforma from './Proforma'
import Invoice from './Invoice'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Welcome, loader: loadResults },
      { path: 'input-form', Component: InputForm, loader: loadResults },
      {
        path: 'planning-view',
        Component: PlanningView,
        loader: loadResults,
      },
      { path: 'vouchers', Component: Vouchers },
      { path: 'proforma', Component: Proforma },
      { path: 'invoice', Component: Invoice },
    ],
  },
])

export default router
