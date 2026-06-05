import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import AdminLayout from './components/AdminLayout'
import LoginPage from './pages/LoginPage'
import PanoramicaPage from './pages/PanoramicaPage'
import MovimentiPage from './pages/MovimentiPage'
import FatturePage from './pages/FatturePage'
import PreventiviPage from './pages/PreventiviPage'
import RitenutePage from './pages/RitenutePage'
import ClientiPage from './pages/ClientiPage'

const AdminApp = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<PanoramicaPage />} />
        <Route path="/movimenti" element={<MovimentiPage />} />
        <Route path="/clienti" element={<ClientiPage />} />
        <Route path="/fatture" element={<FatturePage />} />
        <Route path="/preventivi" element={<PreventiviPage />} />
        <Route path="/ritenute" element={<RitenutePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
)

export default AdminApp
