import { createContext, useState } from 'react';
import { initialRaids, initialUsers, initialFailures } from '../data/mockData';

export const RaidContext = createContext();

export function RaidProvider({ children }) {
  const [raids, setRaids] = useState(initialRaids);
  const [users, setUsers] = useState(initialUsers);
  const [failures, setFailures] = useState(initialFailures);

  const changeRaidState = (raidId, newState, userRole) => {
    setRaids(prev => prev.map(raid => {
      if (raid.id !== raidId) return raid;

      if (raid.state === "Planning" && newState === "Locked") {
        if (userRole === "Raid Leader" || userRole === "Officer") {
          return { ...raid, state: newState };
        }
      }

      if (raid.state === "InProgress" && (newState === "Completed" || newState === "Failed")) {
        if (userRole === "Raid Leader") {
          applyRaidEndReliability(raid.id, newState);
          return { ...raid, state: newState };
        }
      }

      return raid;
    }));
  };

  const addFailure = (userId, raidId, type, severity) => {
    const newFailure = { id: Date.now(), userId, raidId, type, severity: Number(severity) };
    const updatedFailures = [...failures, newFailure];
    setFailures(updatedFailures);

    const totalRaidFailures = updatedFailures
      .filter(f => f.userId === userId && f.raidId === raidId)
      .reduce((sum, f) => sum + f.severity, 0);

    if (totalRaidFailures >= 8) {
      setUsers(prevUsers => prevUsers.map(u => {
        if (u.id === userId) {
          return { ...u, role: "Bench", reliability: Math.max(0, u.reliability - 10) };
        }
        return u;
      }));
    }
  };

  const applyRaidEndReliability = (raidId, result) => {
    setUsers(prev => prev.map(u => {
      if (result === "Completed") return { ...u, reliability: u.reliability + 10 };
      if (result === "Failed") {
        const penalty = u.role === "Raid Leader" ? 15 : 5;
        return { ...u, reliability: Math.max(0, u.reliability - penalty) };
      }
      return u;
    }));
  };

  return (
    <RaidContext.Provider value={{ raids, users, failures, changeRaidState, addFailure }}>
      {children}
    </RaidContext.Provider>
  );
}