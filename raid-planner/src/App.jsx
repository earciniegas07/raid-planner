import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { RaidProvider } from './context/RaidContext';
import { Navbar } from './components/Navbar';
import { ClanPage } from './pages/ClanPage';
import { RaidsPage } from './pages/RaidsPage';
import { HallOfShame } from './pages/HallOfShame';
import './theme.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('raids');

  return (
    <AuthProvider>
      <RaidProvider>
        <div className="app-shell">
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'clans' && <ClanPage />}
          {activeTab === 'raids' && <RaidsPage />}
          {activeTab === 'hall' && <HallOfShame />}
        </div>
      </RaidProvider>
    </AuthProvider>
  );
}