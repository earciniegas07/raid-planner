import { useRaids } from '../context/RaidContext';
import { RaidForm } from '../components/RaidForm';
import { ClanForm } from '../components/ClanForm';
import { FailureTracker } from '../components/FailureTracker';
import { PageState } from '../components/PageState';

// Vista restringida a Raid Leader / Officer (ver ProtectedRoute adminOnly en App.jsx)
export function AdminPage() {
  const { clans, loading, error, reload, createRaid, createClan } = useRaids();

  return (
    <div className="page">
      <h2>Panel de administración</h2>
      <PageState loading={loading} error={error} onRetry={reload}>
        <div className="grid-2">
          {clans.length === 0 ? (
            <div className="form-panel">
              <h3>Nueva raid</h3>
              <p className="muted">Primero crea un clan para poder programar raids.</p>
            </div>
          ) : (
            <RaidForm clans={clans} onSubmit={createRaid} />
          )}
          <ClanForm onSubmit={createClan} />
        </div>
        <FailureTracker />
      </PageState>
    </div>
  );
}
