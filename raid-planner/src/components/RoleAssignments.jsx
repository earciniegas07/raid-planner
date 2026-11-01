import { useAuth } from '../context/AuthContext';
import { useRaids } from '../context/RaidContext';
import { ATTENDANCE_LABEL } from '../utils/format';

const TACTICAL_ROLES = ['Tank', 'Healer', 'DPS', 'Support', 'Bench'];

export function RoleAssignments({ raid }) {
  const { isAdmin } = useAuth();
  const { overrideAssignment, busy } = useRaids();

  const assignments = (raid.assignments || []).filter((a) => a.user);
  if (assignments.length === 0) return null;

  const canOverride = isAdmin && ['Locked', 'InProgress'].includes(raid.state);

  return (
    <div className="assignments">
      <h3>Roles asignados</h3>
      <div className="assignments-list">
        {assignments.map((a) => (
          <div key={a.user._id} className="raid-frame" data-class={a.user.class}>
            <span className="name">{a.user.gamertag}</span>
            {canOverride ? (
              <select
                value={a.tacticalRole}
                disabled={busy}
                onChange={(e) => overrideAssignment(raid._id, a.user._id, e.target.value)}
              >
                {TACTICAL_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            ) : (
              <span className="class-tag" style={{ color: a.tacticalRole === 'Bench' ? 'var(--state-bench)' : 'var(--accent)' }}>
                {a.tacticalRole}{a.source === 'manual' ? ' *' : ''}
              </span>
            )}
            <span className="attendance-chip" data-attendance={a.attendance}>
              {ATTENDANCE_LABEL[a.attendance] || a.attendance}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
