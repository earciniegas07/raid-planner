import { useContext, useState } from 'react';
import { RaidContext } from '../context/RaidContext';

export function FailureTracker() {
  const { users, raids, addFailure } = useContext(RaidContext);
  const [selectedUser, setSelectedUser] = useState(users[0]?.id || 1);
  const [selectedRaid, setSelectedRaid] = useState(raids[0]?.id || 101);
  const [failureType, setFailureType] = useState('Failed mechanic');
  const [severity, setSeverity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    addFailure(Number(selectedUser), Number(selectedRaid), failureType, Number(severity));
    alert('Fallo registrado correctamente');
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
          <option value="Failed mechanic">Failed mechanic</option>
          <option value="Interrupted wrong target">Interrupted wrong target</option>
          <option value="Pulled early">Pulled early</option>
          <option value="Broke CC">Broke CC</option>
          <option value="Wrong positioning">Wrong positioning</option>
          <option value="AFK during pull">AFK during pull</option>
        </select>
        <select value={severity} onChange={e => setSeverity(e.target.value)}>
          <option value={1}>Minor (1 pt)</option>
          <option value={3}>Major (3 pts)</option>
          <option value={5}>Critical (5 pts)</option>
        </select>
        <button type="submit" className="btn btn-danger">Registrar</button>
      </div>
    </form>
  );
}