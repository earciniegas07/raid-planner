import { useContext } from 'react';
import { RaidContext } from '../context/RaidContext';

export function HallOfShame() {
  const { users, failures } = useContext(RaidContext);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Rankings & Hall of Shame</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#111827', padding: '15px', borderRadius: '8px', color: '#fff' }}>
          <h3>Jugadores más Fiables</h3>
          <ul>
            {[...users]
              .sort((a, b) => b.reliability - a.reliability)
              .map(u => (
                <li key={u.id}>
                  {u.gamertag} - {u.reliability} pts ({u.role})
                </li>
              ))}
          </ul>
        </div>
        <div style={{ background: '#111827', padding: '15px', borderRadius: '8px', color: '#fff' }}>
          <h3>Historial de Fallos (Audit Log)</h3>
          <ul>
            {failures.slice(-10).map(f => {
              const user = users.find(u => u.id === f.userId);
              return (
                <li key={f.id} style={{ color: f.severity === 5 ? '#ef4444' : '#f59e0b' }}>
                  <strong>{user?.gamertag}</strong>: {f.type} (Gravedad: {f.severity})
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}