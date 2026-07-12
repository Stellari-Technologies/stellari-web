import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import RootRedirect from './components/RootRedirect'
import { ScanScreen } from './pages/ScanScreen'
import DashboardPage from './pages/DashboardPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import VerifyEmailPage from './pages/VerifyEmailPage'
import AdminOverviewPage from './pages/AdminOverviewPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
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
          path="/scan"
          element={
            <ProtectedRoute>
              <ScanScreen />
            </ProtectedRoute>
          }
        />
        <Route path="/verify-email"  element={<VerifyEmailPage />} />
        <Route path="/dashboard/app" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App