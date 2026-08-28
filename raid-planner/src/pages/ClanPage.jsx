import { useContext } from 'react';
import { RaidContext } from '../context/RaidContext';
import { initialClans } from '../data/mockData';

export function ClanPage() {
  const { users } = useContext(RaidContext);

  const th = { padding: '10px' };
  const td = { padding: '8px' };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Clanes & Lista de Miembros</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
        {initialClans.map(clan => (
          <div key={clan.id} style={{ border: '1px solid #4b5563', padding: '15px', borderRadius: '8px', background: '#111827', color: '#fff' }}>
            <h3>{clan.name}</h3>
            <p>Facción: <strong>{clan.faction}</strong></p>
            <p>{clan.description}</p>
          </div>
        ))}
      </div>
      <h3>Miembros Registrados</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', background: '#1f2937' }}>
        <thead>
          <tr style={{ background: '#374151' }}>
            <th style={th}>Gamertag</th>
            <th style={th}>Clase</th>
            <th style={th}>Nivel</th>
            <th style={th}>Rol Clan</th>
            <th style={th}>Fiabilidad</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ textAlign: 'center', borderBottom: '1px solid #374151' }}>
              <td style={td}>{u.gamertag}</td>
              <td style={td}>{u.class}</td>
              <td style={td}>{u.level}</td>
              <td style={td}>{u.role}</td>
              <td style={td}>{u.reliability} pts</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}