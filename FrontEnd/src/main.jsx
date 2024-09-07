import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './Router/Router.jsx'
import { JobsProvider } from './context/jobsContext.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  <JobsProvider>
  <RouterProvider router={router} />
  </JobsProvider>

)
