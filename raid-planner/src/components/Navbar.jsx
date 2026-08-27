import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function Navbar({ activeTab, setActiveTab }) {
  const { currentUser, switchUser, users } = useContext(AuthContext);

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', background: '#1e1e24', color: '#fff', alignItems: 'center' }}>
      <div>
        <h2 style={{ margin: 0 }}>🛡️ RaidPlanner</h2>
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        <button onClick={() => setActiveTab('clans')} style={btnStyle(activeTab === 'clans')}>Clanes</button>
        <button onClick={() => setActiveTab('raids')} style={btnStyle(activeTab === 'raids')}>Raids</button>
        <button onClick={() => setActiveTab('hall')} style={btnStyle(activeTab === 'hall')}>Hall of Shame & Rankings</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <small>Usuario:</small>
        <select value={currentUser?.id} onChange={(e) => switchUser(e.target.value)} style={{ padding: '5px' }}>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.gamertag} ({u.role} - Lv.{u.level})</option>
          ))}
        </select>
      </div>
    </nav>
  );
}

const btnStyle = (active) => ({
  background: active ? '#4f46e5' : '#374151',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer'
});