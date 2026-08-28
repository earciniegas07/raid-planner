import { useContext } from 'react';
import { RaidContext } from '../context/RaidContext';
import { AuthContext } from '../context/AuthContext';

const TACTICAL_ROLES = ['Tank', 'Healer', 'DPS', 'Support', 'Bench'];

export function RoleAssignments({ raidId }) {
  const { raidAssignments, users, overrideAssignment } = useContext(RaidContext);
  const { currentUser } = useContext(AuthContext);

  const assignments = raidAssignments[raidId] || [];
  if (assignments.length === 0) return null;

  const canOverride = currentUser?.role === 'Raid Leader';

  return (
    <div style={{ marginTop: '10px', background: '#111827', padding: '10px', borderRadius: '6px' }}>
      <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#93c5fd' }}>Roles Asignados</h4>
      <table style={{ width: '100%', fontSize: '13px', color: '#fff' }}>
        <tbody>
          {assignments.map(a => {
            const user = users.find(u => u.id === a.userId);
            if (!user) return null;
            return (
              <tr key={a.userId}>
                <td style={{ padding: '2px 4px' }}>{user.gamertag} ({user.class})</td>
                <td style={{ padding: '2px 4px' }}>
                  {canOverride ? (
                    <select
                      value={a.tacticalRole}
                      onChange={e => overrideAssignment(raidId, a.userId, e.target.value)}
                    >
                      {TACTICAL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  ) : (
                    <span style={{ color: a.tacticalRole === 'Bench' ? '#f59e0b' : '#34d399' }}>
                      {a.tacticalRole}{a.source === 'manual' ? ' (manual)' : ''}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}