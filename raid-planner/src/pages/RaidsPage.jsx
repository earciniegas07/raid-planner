import { useContext } from 'react';
import { RaidContext } from '../context/RaidContext';
import { RaidCard } from '../components/RaidCard';
import { FailureTracker } from '../components/FailureTracker';

export function RaidsPage() {
  const { raids } = useContext(RaidContext);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestión de Raids</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
        {raids.map(raid => (
          <RaidCard key={raid.id} raid={raid} />
        ))}
      </div>
      <FailureTracker />
    </div>
  );
}