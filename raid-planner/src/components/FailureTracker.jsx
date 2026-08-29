import { useContext, useState } from 'react';
import { RaidContext } from '../context/RaidContext';

const FAILURE_TYPES = [
  'Failed mechanic',
  'Interrupted wrong target',
  'Pulled early',
  'Broke CC',
  'Wrong positioning',
  'AFK during pull',
];

export function FailureTracker() {
  const { users, raids, addFailure } = useContext(RaidContext);
  const [selectedUser, setSelectedUser] = useState(users[0]?.id || '');
  const [selectedRaid, setSelectedRaid] = useState(raids[0]?.id || '');
  const [failureType, setFailureType] = useState(FAILURE_TYPES[0]);
  const [severity, setSeverity] = useState(1);
  const [feedback, setFeedback] = useState(null);

  if (users.length === 0 || raids.length === 0) {
    return (
      <div className="form-panel">
        <p>No hay jugadores o raids disponibles para registrar fallos todavía.</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedUser || !selectedRaid) {
      setFeedback({ type: 'error', text: 'Selecciona un jugador y una raid antes de registrar el fallo.' });
      return;
    }

    const raid = raids.find(r => r.id === Number(selectedRaid));
    if (raid && raid.state === 'Planning') {
      setFeedback({ type: 'error', text: 'No se puede registrar un fallo en una raid que todavía está en Planning (aún no empieza).' });
      return;
    }

    addFailure(Number(selectedUser), Number(selectedRaid), failureType, Number(severity));

    const user = users.find(u => u.id === Number(selectedUser));
    setFeedback({ type: 'success', text: `Fallo registrado para ${user?.gamertag}.` });
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <form onSubmit={handleSubmit} className="form-panel">
      <h3>Registrar Fallo Mecánico ("Fallómetro")</h3>
      <div className="form-row">
        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
          {users.map(u => <option key={u.id} value={u.id}>{u.gamertag} ({u.class})</option>)}
        </select>
        <select value={selectedRaid} onChange={e => setSelectedRaid(e.target.value)}>
          {raids.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <select value={failureType} onChange={e => setFailureType(e.target.value)}>
          {FAILURE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={severity} onChange={e => setSeverity(e.target.value)}>
          <option value={1}>Minor (1 pt)</option>
          <option value={3}>Major (3 pts)</option>
          <option value={5}>Critical (5 pts)</option>
        </select>
        <button type="submit" className="btn btn-danger">Registrar</button>
      </div>

      {feedback && (
        <div className={`form-feedback ${feedback.type}`}>{feedback.text}</div>
      )}
    </form>
  );
}