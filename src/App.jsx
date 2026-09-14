import { useState } from 'react'
import TeacherForm from './pages/TeacherForm'
import HRLogin from './pages/HRLogin'
import HRDashboard from './pages/HRDashboard'
import Header from './components/Header'

function App() {
  const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '')
  const hash = window.location.hash.toLowerCase()
  const params = new URLSearchParams(window.location.search)

  // يدعم /hr أو /hr/ أو ?view=hr أو #/hr
  const isHrRoute =
    pathname === '/hr' ||
    pathname.endsWith('/hr') ||
    hash === '#hr' ||
    hash === '#/hr' ||
    params.get('view') === 'hr'

  const [view, setView] = useState(isHrRoute ? 'hr-login' : 'form')

  return (
    <>
      <Header view={view} onLogout={() => setView('hr-login')} />
      {view === 'form' && <TeacherForm />}
      {view === 'hr-login' && <HRLogin onSuccess={() => setView('hr-dashboard')} />}
      {view === 'hr-dashboard' && <HRDashboard onLogout={() => setView('hr-login')} />}
    </>
  )
}

export default App
