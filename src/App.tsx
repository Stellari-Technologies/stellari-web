import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import AdminOverviewPage from './pages/AdminOverviewPage'
import DashboardPage from './pages/DashboardPage'
import RootRedirect from './components/RootRedirect'
import { ScanScreen } from './pages/ScanScreen'
import { ProtectedRoute } from './components/ProtectedRoute'
import OrgSetupPage from './pages/OrgSetupPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/org-setup" element={<OrgSetupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminOverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/app"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/scan" element={<ScanScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App