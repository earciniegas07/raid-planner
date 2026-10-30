import { useContext } from 'react';
import { RaidContext } from '../context/RaidContext';
import { useAuth } from '../context/AuthContext';

const TACTICAL_ROLES = ['Tank', 'Healer', 'DPS', 'Support', 'Bench'];

export function RoleAssignments({ raidId }) {
  const { raidAssignments, users, overrideAssignment } = useContext(RaidContext);
  const { user: currentUser } = useAuth();

  const assignments = raidAssignments[raidId] || [];
  if (assignments.length === 0) return null;

  const canOverride = currentUser?.role === 'Raid Leader';

  return (
    <div style={{ marginTop: '12px' }}>
      <h3 style={{ fontSize: '13px' }}>Roles Asignados</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {assignments.map(a => {
          const user = users.find(u => u.id === a.userId);
          if (!user) return null;
          return (
            <div key={a.userId} className="raid-frame" data-class={user.class}>
              <span className="name">{user.gamertag}</span>
              {canOverride ? (
                <select value={a.tacticalRole} onChange={e => overrideAssignment(raidId, a.userId, e.target.value)}>
                  {TACTICAL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              ) : (
                <span className="class-tag" style={{ color: a.tacticalRole === 'Bench' ? 'var(--state-bench)' : 'var(--accent)' }}>
                  {a.tacticalRole}{a.source === 'manual' ? ' *' : ''}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}