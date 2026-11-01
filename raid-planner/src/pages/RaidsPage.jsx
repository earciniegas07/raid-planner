import { useState } from 'react';
import { useRaids } from '../context/RaidContext';
import { RaidCard } from '../components/RaidCard';
import { PageState } from '../components/PageState';

const STATES = ['Planning', 'Locked', 'InProgress', 'Completed', 'Failed'];

export function RaidsPage() {
  const { raids, loading, error, reload } = useRaids();
  const [filter, setFilter] = useState('');

  const visible = filter ? raids.filter((r) => r.state === filter) : raids;

  return (
    <div className="page">
      <h2>Gestión de raids</h2>
      <PageState loading={loading} error={error} onRetry={reload}>
        <div className="form-row toolbar">
          <label htmlFor="state-filter">Filtrar por estado</label>
          <select id="state-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Todos</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {visible.length === 0 ? (
          <p className="muted">No hay raids para mostrar.</p>
        ) : (
          <div className="grid-cards">
            {visible.map((raid) => <RaidCard key={raid._id} raid={raid} />)}
          </div>
        )}
      </PageState>
    </div>
  );
}
