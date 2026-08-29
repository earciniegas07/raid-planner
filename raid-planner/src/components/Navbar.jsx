import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function Navbar({ activeTab, setActiveTab }) {
  const { currentUser, switchUser, users } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <h2 className="nav-brand">Raid<span>Planner</span></h2>

      <div className="nav-tabs">
        <button className={`nav-tab ${activeTab === 'clans' ? 'active' : ''}`} onClick={() => setActiveTab('clans')}>Clanes</button>
        <button className={`nav-tab ${activeTab === 'raids' ? 'active' : ''}`} onClick={() => setActiveTab('raids')}>Raids</button>
        <button className={`nav-tab ${activeTab === 'hall' ? 'active' : ''}`} onClick={() => setActiveTab('hall')}>Hall of Shame</button>
      </div>

      <div className="nav-user">
        <small>Usuario</small>
        <select value={currentUser?.id} onChange={(e) => switchUser(e.target.value)}>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.gamertag} ({u.role} · Lv.{u.level})</option>
          ))}
        </select>
      </div>
    </nav>
  );
}