import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { RaidProvider } from './context/RaidContext';
import { Navbar } from './components/Navbar';
import { ClanPage } from './pages/ClanPage';
import { RaidsPage } from './pages/RaidsPage';
import { HallOfShame } from './pages/HallOfShame';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('raids');

  return (
    <AuthProvider>
      <RaidProvider>
        <div style={{ background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'clans' && <ClanPage />}
          {activeTab === 'raids' && <RaidsPage />}
          {activeTab === 'hall' && <HallOfShame />}
        </div>
      </RaidProvider>
    </AuthProvider>
  );
}