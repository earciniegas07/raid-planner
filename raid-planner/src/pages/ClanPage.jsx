import { useContext } from 'react';
import { RaidContext } from '../context/RaidContext';
import { initialClans } from '../data/mockData';

export function ClanPage() {
  const { users } = useContext(RaidContext);

  return (
    <div className="page">
      <h2>Clanes & Miembros</h2>

      <div className="grid-3">
        {initialClans.map(clan => (
          <div key={clan.id} className="clan-card">
            <h3>{clan.name}</h3>
            <span className="faction">{clan.faction}</span>
            <p className="desc">{clan.description}</p>
          </div>
        ))}
      </div>

      <h3>Roster</h3>
      <div className="frame-grid">
        {users.map(u => (
          <div key={u.id} className="raid-frame" data-class={u.class}>
            <span className="name">{u.gamertag}</span>
            <span className="class-tag">{u.class}</span>
            <span className="stat">Lv.{u.level}</span>
            <div className="reliability-bar" title={`${u.reliability} pts`}>
              <span style={{ width: `${Math.min(100, u.reliability)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}