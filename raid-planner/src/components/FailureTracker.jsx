import { useState } from 'react';
import { useRaids } from '../context/RaidContext';

const FAILURE_TYPES = [
  'Failed mechanic',
  'Interrupted wrong target',
  'Pulled early',
  'Broke CC',
  'Wrong positioning',
  'AFK during pull',
];

export function FailureTracker() {
  const { raids, addFailure, busy } = useRaids();
  const [raidId, setRaidId] = useState('');
  const [userId, setUserId] = useState('');
  const [failureType, setFailureType] = useState(FAILURE_TYPES[0]);
  const [severity, setSeverity] = useState(1);

  // Solo raids que ya empezaron a prepararse (con asignaciones)
  const eligible = raids.filter((r) => r.state !== 'Planning');
  const raid = eligible.find((r) => r._id === raidId) ?? eligible[0];
  const players = (raid?.assignments || []).filter((a) => a.user);
  const selectedUser = players.some((a) => a.user._id === userId) ? userId : players[0]?.user._id;

  if (eligible.length === 0) {
    return (
      <div className="form-panel">
        <h3>Registrar fallo mecánico ("Fallómetro")</h3>
        <p className="muted">Aún no hay raids bloqueadas o en curso para registrar fallos.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!raid || !selectedUser) return;
    await addFailure(raid._id, selectedUser, failureType, Number(severity));
  };

  return (
    <form onSubmit={handleSubmit} className="form-panel">
      <h3>Registrar fallo mecánico ("Fallómetro")</h3>
      <div className="form-row">
        <select aria-label="Raid" value={raid?._id ?? ''} onChange={(e) => setRaidId(e.target.value)}>
          {eligible.map((r) => <option key={r._id} value={r._id}>{r.name} ({r.state})</option>)}
        </select>
        <select aria-label="Jugador" value={selectedUser ?? ''} onChange={(e) => setUserId(e.target.value)}>
          {players.map((a) => (
            <option key={a.user._id} value={a.user._id}>{a.user.gamertag} ({a.tacticalRole})</option>
          ))}
        </select>
        <select aria-label="Tipo de fallo" value={failureType} onChange={(e) => setFailureType(e.target.value)}>
          {FAILURE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select aria-label="Gravedad" value={severity} onChange={(e) => setSeverity(e.target.value)}>
          <option value={1}>Minor (1 pt)</option>
          <option value={3}>Major (3 pts)</option>
          <option value={5}>Critical (5 pts)</option>
        </select>
        <button type="submit" className="btn btn-danger" disabled={busy || !selectedUser}>Registrar</button>
      </div>
    </form>
  );
}
