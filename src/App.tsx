import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
<<<<<<< HEAD
import RootRedirect from './components/RootRedirect'
import { ScanScreen } from './pages/ScanScreen'
import { DashboardPage } from './pages/DashboardPage'
import { ProtectedRoute } from './components/ProtectedRoute'

=======
import VerifyEmailPage from './pages/VerifyEmailPage'
import AdminOverviewPage from './pages/AdminOverviewPage'
import DashboardPage from './pages/DashboardPage'
>>>>>>> 2d007bd (Created the admin dashboard with 4 subtabs, Actvities, Rewards, Participant Details, and Create Participant.)

function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scan"
          element={
            <ProtectedRoute>
              <ScanScreen />
            </ProtectedRoute>
          }
        />
=======
        <Route path="/"              element={<LandingPage />} />
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/signup"        element={<SignUpPage />} />
        <Route path="/verify-email"  element={<VerifyEmailPage />} />
        <Route path="/dashboard"     element={<AdminOverviewPage />} />
        <Route path="/dashboard/app" element={<DashboardPage />} />
>>>>>>> 2d007bd (Created the admin dashboard with 4 subtabs, Actvities, Rewards, Participant Details, and Create Participant.)
      </Routes>
    </BrowserRouter>
  )
}

export default App