import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../services/api';
import { useRaids } from '../context/RaidContext';
import { PageState } from '../components/PageState';

const sevColor = (s) =>
  s === 5 ? 'var(--state-failed)' : s === 3 ? 'var(--state-planning)' : 'var(--text-dim)';

function ClanRankings({ clans }) {
  const [clanId, setClanId] = useState(clans[0]?._id ?? '');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!clanId) return;
    let cancelled = false;
    setLoading(true);
    setError('');
    api.get(`/clans/${clanId}/rankings`)
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => { if (!cancelled) setError(getErrorMessage(err)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [clanId, attempt]);

  if (clans.length === 0) return null;

  return (
    <div className="panel">
      <div className="form-row toolbar">
        <h3>Rankings por clan</h3>
        <select aria-label="Clan" value={clanId} onChange={(e) => setClanId(e.target.value)}>
          {clans.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>
      <PageState loading={loading} error={error} onRetry={() => setAttempt((n) => n + 1)}>
        {data && (
          <div className="grid-3">
            <div>
              <h3>Hard Carry</h3>
              {data.hardCarry.length === 0 && <p className="muted">Sin datos</p>}
              {data.hardCarry.map((u) => (
                <div key={u._id} className="raid-frame" data-class={u.class}>
                  <span className="name">{u.gamertag}</span>
                  <span className="stat">{u.reliability} pts</span>
                </div>
              ))}
            </div>
            <div>
              <h3>Bench Warmer</h3>
              {data.benchWarmer.length === 0 && <p className="muted">Nadie en el banquillo</p>}
              {data.benchWarmer.map(({ user, benchCount }) => (
                <div key={user._id} className="raid-frame" data-class={user.class}>
                  <span className="name">{user.gamertag}</span>
                  <span className="stat">{benchCount}× Bench/Declined</span>
                </div>
              ))}
            </div>
            <div>
              <h3>Mechanics Pro</h3>
              {data.mechanicsPro.length === 0 && <p className="muted">Sin datos</p>}
              {data.mechanicsPro.map(({ user, played, severeFailures }) => (
                <div key={user._id} className="raid-frame" data-class={user.class}>
                  <span className="name">{user.gamertag}</span>
                  <span className="stat">{severeFailures} críticos / {played} raids</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </PageState>
    </div>
  );
}

export function HallOfShame() {
  const { rankings, clans, loading, error, reload } = useRaids();

  return (
    <div className="page">
      <h2>Rankings y Hall of Shame</h2>
      <PageState loading={loading} error={error} onRetry={reload}>
        <div className="grid-2">
          <div className="panel">
            <h3>Jugadores más fiables</h3>
            <div className="assignments-list">
              {rankings.mostReliable.length === 0 && <p className="muted">Sin jugadores todavía</p>}
              {rankings.mostReliable.map((u) => (
                <div key={u._id} className="raid-frame" data-class={u.class}>
                  <span className="name">{u.gamertag}</span>
                  <span className="class-tag">{u.role}</span>
                  <span className="stat">{u.reliability} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3>Historial de fallos (audit log)</h3>
            {rankings.recentFailures.length === 0 && <p className="muted">Aún no hay fallos registrados</p>}
            {rankings.recentFailures.map((f) => (
              <div key={f._id} className="audit-item">
                <span className="sev-dot" style={{ background: sevColor(f.severity) }} />
                <strong>{f.user?.gamertag ?? 'Jugador eliminado'}</strong> — {f.type} (gravedad {f.severity})
                {f.raid?.name && <span className="muted"> · {f.raid.name}</span>}
              </div>
            ))}
          </div>
        </div>
        <ClanRankings clans={clans} />
      </PageState>
    </div>
  );
}
