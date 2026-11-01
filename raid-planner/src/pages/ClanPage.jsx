import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRaids } from '../context/RaidContext';
import { ClanForm } from '../components/ClanForm';
import { PageState } from '../components/PageState';

const CLASSES = ['Tank', 'Healer', 'DPS', 'Support'];

function ClanCard({ clan, memberCount }) {
  const { user, isAdmin } = useAuth();
  const { busy, joinClan, updateClan, deleteClan } = useRaids();
  const [editing, setEditing] = useState(false);

  const isMine = String(user.clanId) === clan._id;
  const limits = CLASSES.filter((c) => clan.roleLimits?.[c] != null).map((c) => `${c}: ${clan.roleLimits[c]}`);

  if (editing) {
    return (
      <div className="clan-card">
        <ClanForm
          initial={clan}
          submitLabel="Guardar cambios"
          onCancel={() => setEditing(false)}
          onSubmit={async (payload) => {
            const ok = await updateClan(clan._id, payload);
            if (ok) setEditing(false);
            return ok;
          }}
        />
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`¿Eliminar el clan "${clan.name}"? Sus miembros quedarán sin clan.`)) {
      deleteClan(clan._id);
    }
  };

  return (
    <div className="clan-card">
      {clan.banner && (
        <img className="clan-banner" src={clan.banner} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      )}
      <h3>{clan.name}</h3>
      <span className="faction">{clan.faction}</span>
      <p className="desc">{clan.description}</p>
      <p className="muted">{memberCount} miembro(s){limits.length > 0 && ` · Cupos → ${limits.join(', ')}`}</p>

      <div className="form-row actions">
        {isMine ? (
          <span className="badge" data-state="Completed">Tu clan</span>
        ) : (
          <button className="btn btn-primary" disabled={busy} onClick={() => joinClan(clan._id)}>Unirme</button>
        )}
        {isAdmin && <button className="btn" disabled={busy} onClick={() => setEditing(true)}>Editar</button>}
        {user.role === 'Raid Leader' && (
          <button className="btn btn-danger" disabled={busy} onClick={handleDelete}>Eliminar</button>
        )}
      </div>
    </div>
  );
}

export function ClanPage() {
  const { clans, users, loading, error, reload } = useRaids();
  const [clanFilter, setClanFilter] = useState('');

  const roster = clanFilter ? users.filter((u) => u.clanId?._id === clanFilter) : users;

  return (
    <div className="page">
      <h2>Clanes y miembros</h2>
      <PageState loading={loading} error={error} onRetry={reload}>
        {clans.length === 0 ? (
          <p className="muted">Todavía no hay clanes. Un administrador puede crearlos desde el panel.</p>
        ) : (
          <div className="grid-3">
            {clans.map((clan) => (
              <ClanCard
                key={clan._id}
                clan={clan}
                memberCount={users.filter((u) => u.clanId?._id === clan._id).length}
              />
            ))}
          </div>
        )}

        <div className="form-row toolbar">
          <h3>Roster</h3>
          <select aria-label="Filtrar roster por clan" value={clanFilter} onChange={(e) => setClanFilter(e.target.value)}>
            <option value="">Todos los clanes</option>
            {clans.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        {roster.length === 0 ? (
          <p className="muted">No hay jugadores en este clan.</p>
        ) : (
          <div className="frame-grid">
            {roster.map((u) => (
              <div key={u._id} className="raid-frame" data-class={u.class}>
                <span className="name">{u.gamertag}</span>
                <span className="class-tag">{u.class}</span>
                <span className="stat">Lv.{u.level}</span>
                <div className="reliability-bar" title={`${u.reliability} pts`}>
                  <span style={{ width: `${Math.min(100, u.reliability)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </PageState>
    </div>
  );
}
