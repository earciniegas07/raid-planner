import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { RaidProvider } from './context/RaidContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ClanPage } from './pages/ClanPage';
import { RaidsPage } from './pages/RaidsPage';
import { HallOfShame } from './pages/HallOfShame';
import { AdminPage } from './pages/AdminPage';
import './theme.css';
import './extra.css';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <RaidProvider>
            <div className="app-shell">
              <Navbar />
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/clans" element={<ClanPage />} />
                  <Route path="/raids" element={<RaidsPage />} />
                  <Route path="/hall" element={<HallOfShame />} />
                </Route>
                <Route element={<ProtectedRoute adminOnly />}>
                  <Route path="/admin" element={<AdminPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/raids" replace />} />
              </Routes>
            </div>
          </RaidProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
