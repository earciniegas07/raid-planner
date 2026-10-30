import { useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { RaidContext } from '../context/RaidContext';
import { RoleAssignments } from './RoleAssignments';

export function RaidCard({ raid }) {
  const { user: currentUser } = useAuth();
  const { changeRaidState } = useContext(RaidContext);

  return (
    <div className="raid-card">
      <h3>{raid.name}</h3>
      <p>Dificultad: <strong>{raid.difficulty}</strong></p>
      <p>Estado: <span className="badge" data-state={raid.state}>{raid.state}</span></p>
      <p>{raid.durationHours}h · {raid.minPlayers}-{raid.maxPlayers} jugadores</p>

      <div className="form-row" style={{ marginTop: '10px' }}>
        {raid.state === 'Planning' && (
          <button className="btn btn-primary" onClick={() => changeRaidState(raid.id, 'Locked', currentUser.role)}>
            Bloquear Raid
          </button>
        )}
        {raid.state === 'InProgress' && currentUser.role === 'Raid Leader' && (
          <>
            <button className="btn btn-success" onClick={() => changeRaidState(raid.id, 'Completed', currentUser.role)}>Completar (+10)</button>
            <button className="btn btn-danger" onClick={() => changeRaidState(raid.id, 'Failed', currentUser.role)}>Marcar Fallida (-5)</button>
          </>
        )}
      </div>

      {raid.state !== 'Planning' && <RoleAssignments raidId={raid.id} />}
    </div>
  );
}