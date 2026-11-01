import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRaids } from '../context/RaidContext';
import { RoleAssignments } from './RoleAssignments';
import { RaidForm } from './RaidForm';
import { formatDate } from '../utils/format';

export function RaidCard({ raid }) {
  const { user, isAdmin } = useAuth();
  const { clans, busy, changeRaidState, updateRaid, deleteRaid, checkIn, checkOut } = useRaids();
  const [editing, setEditing] = useState(false);

  const isLeader = user.role === 'Raid Leader';
  const mine = (raid.assignments || []).find((a) => a.user?._id === user.id);
  const canAttend = Boolean(mine) && ['Locked', 'InProgress'].includes(raid.state);
  const roles = Object.entries(raid.requiredRoles || {})
    .filter(([, n]) => n > 0)
    .map(([r, n]) => `${n} ${r}`)
    .join(' · ');

  if (editing) {
    return (
      <div className="raid-card">
        <RaidForm
          clans={clans}
          initial={raid}
          submitLabel="Guardar cambios"
          onCancel={() => setEditing(false)}
          onSubmit={async (payload) => {
            const ok = await updateRaid(raid._id, payload);
            if (ok) setEditing(false);
            return ok;
          }}
        />
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`¿Eliminar la raid "${raid.name}"? También se borrarán sus fallos.`)) {
      deleteRaid(raid._id);
    }
  };

  return (
    <div className="raid-card">
      <h3>{raid.name}</h3>
      <p>Clan: <strong>{raid.clanId?.name ?? '—'}</strong> · Dificultad: <strong>{raid.difficulty}</strong></p>
      <p>Estado: <span className="badge" data-state={raid.state}>{raid.state}</span></p>
      <p>{formatDate(raid.startTime)} · {raid.durationHours}h · {raid.minPlayers}-{raid.maxPlayers} jugadores</p>
      {roles && <p className="muted">Requiere: {roles}</p>}

      <div className="form-row actions">
        {isAdmin && raid.state === 'Planning' && (
          <button className="btn btn-primary" disabled={busy} onClick={() => changeRaidState(raid._id, 'Locked')}>
            Bloquear raid
          </button>
        )}
        {isAdmin && raid.state === 'Locked' && (
          <button className="btn btn-primary" disabled={busy} onClick={() => changeRaidState(raid._id, 'InProgress')}>
            Iniciar raid
          </button>
        )}
        {isLeader && raid.state === 'InProgress' && (
          <>
            <button className="btn btn-success" disabled={busy} onClick={() => changeRaidState(raid._id, 'Completed')}>
              Completar (+10)
            </button>
            <button className="btn btn-danger" disabled={busy} onClick={() => changeRaidState(raid._id, 'Failed')}>
              Marcar fallida (-5)
            </button>
          </>
        )}
        {canAttend && mine.attendance !== 'Confirmed' && (
          <button className="btn btn-success" disabled={busy} onClick={() => checkIn(raid._id)}>
            Check-in
          </button>
        )}
        {canAttend && mine.attendance !== 'Declined' && (
          <button className="btn" disabled={busy} onClick={() => checkOut(raid._id)}>
            No podré asistir
          </button>
        )}
        {isAdmin && raid.state === 'Planning' && (
          <button className="btn" disabled={busy} onClick={() => setEditing(true)}>Editar</button>
        )}
        {isAdmin && (
          <button className="btn btn-danger" disabled={busy} onClick={handleDelete}>Eliminar</button>
        )}
      </div>

      {raid.state !== 'Planning' && <RoleAssignments raid={raid} />}
    </div>
  );
}
