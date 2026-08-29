import { useContext } from 'react';
import { RaidContext } from '../context/RaidContext';

export function HallOfShame() {
  const { users, failures } = useContext(RaidContext);

  return (
    <div className="page">
      <h2>Rankings & Hall of Shame</h2>
      <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="panel">
          <h3>Jugadores más Fiables</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[...users].sort((a, b) => b.reliability - a.reliability).map(u => (
              <div key={u.id} className="raid-frame" data-class={u.class}>
                <span className="name">{u.gamertag}</span>
                <span className="class-tag">{u.role}</span>
                <span className="stat">{u.reliability} pts</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>Historial de Fallos (Audit Log)</h3>
          {failures.slice(-10).reverse().map(f => {
            const user = users.find(u => u.id === f.userId);
            const sevColor = f.severity === 5 ? 'var(--state-failed)' : f.severity === 3 ? 'var(--state-planning)' : 'var(--text-dim)';
            return (
              <div key={f.id} className="audit-item">
                <span className="sev-dot" style={{ background: sevColor }} />
                <strong>{user?.gamertag}</strong> — {f.type} (Gravedad: {f.severity})
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}