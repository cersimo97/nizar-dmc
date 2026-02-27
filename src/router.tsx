import { createBrowserRouter } from 'react-router'
import Layout from './Layout'
import Welcome from './Welcome'
import InputForm from './InputForm'
import PlanningView from './PlanningView'
import loadResults from './loaders/loadResults'

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
    ],
  },
])

export default router
