import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RaidProvider } from './context/RaidContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ClanPage } from './pages/ClanPage';
import { RaidsPage } from './pages/RaidsPage';
import { HallOfShame } from './pages/HallOfShame';
import './theme.css';

export default function App() {
  return (
    <BrowserRouter>
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
              <Route path="*" element={<Navigate to="/raids" replace />} />
            </Routes>
          </div>
        </RaidProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}