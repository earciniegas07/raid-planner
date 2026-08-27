import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { RaidContext } from '../context/RaidContext';

export function RaidCard({ raid }) {
  const { currentUser } = useContext(AuthContext);
  const { changeRaidState } = useContext(RaidContext);

  return (
    <div style={{ border: '1px solid #374151', borderRadius: '8px', padding: '15px', background: '#2a2b36', color: '#fff' }}>
      <h3>{raid.name}</h3>
      <p>Dificultad: <strong>{raid.difficulty}</strong></p>
      <p>Estado actual: <span style={{ color: getStateColor(raid.state), fontWeight: 'bold' }}>{raid.state}</span></p>
      <p>Duración: {raid.durationHours} hrs | Min: {raid.minPlayers} - Max: {raid.maxPlayers}</p>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        {raid.state === 'Planning' && (
          <button onClick={() => changeRaidState(raid.id, 'Locked', currentUser.role)}>
            Bloquear Raid (Locked)
          </button>
        )}
        {raid.state === 'InProgress' && currentUser.role === 'Raid Leader' && (
          <>
            <button onClick={() => changeRaidState(raid.id, 'Completed', currentUser.role)}>Marcar Completada (+10 pts)</button>
            <button onClick={() => changeRaidState(raid.id, 'Failed', currentUser.role)}>Marcar Fallida (-5 pts)</button>
          </>
        )}
      </div>
    </div>
  );
}

const getStateColor = (state) => {
  switch (state) {
    case 'Planning': return '#f59e0b';
    case 'Locked': return '#3b82f6';
    case 'InProgress': return '#10b981';
    case 'Completed': return '#8b5cf6';
    case 'Failed': return '#ef4444';
    default: return '#fff';
  }
};