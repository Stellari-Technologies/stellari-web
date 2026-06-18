import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import AdminOverviewPage from './pages/AdminOverviewPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<LandingPage />} />
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/signup"        element={<SignUpPage />} />
        <Route path="/verify-email"  element={<VerifyEmailPage />} />
        <Route path="/dashboard"     element={<AdminOverviewPage />} />
        <Route path="/dashboard/app" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App