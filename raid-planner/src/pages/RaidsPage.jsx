import { useContext } from 'react';
import { RaidContext } from '../context/RaidContext';
import { RaidCard } from '../components/RaidCard';
import { FailureTracker } from '../components/FailureTracker';

export function RaidsPage() {
  const { raids } = useContext(RaidContext);

  return (
    <div className="page">
      <h2>Gestión de Raids</h2>
      <div className="grid-cards">
        {raids.map(raid => <RaidCard key={raid.id} raid={raid} />)}
      </div>
      <FailureTracker />
    </div>
  );
}