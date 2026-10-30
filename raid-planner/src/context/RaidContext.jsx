import { createContext, useState } from 'react';
import { initialRaids, initialUsers, initialFailures } from '../data/mockData';

export const RaidContext = createContext();

// Ordena candidatos: Officer/Raid Leader primero, luego mayor nivel
function seniorityRank(user) {
  return user.role === 'Officer' || user.role === 'Raid Leader' ? 0 : 1;
}

function assignRolesForRaid(raid, allUsers) {
  const pool = allUsers.filter(u => u.clanId === raid.clanId && u.role !== 'Bench');
  const required = raid.requiredRoles || {};
  const assignments = [];
  const usedIds = new Set();

  Object.entries(required).forEach(([tacticalRole, count]) => {
    const candidates = pool
      .filter(u => u.class === tacticalRole && !usedIds.has(u.id))
      .sort((a, b) => {
        const seniorityDiff = seniorityRank(a) - seniorityRank(b);
        if (seniorityDiff !== 0) return seniorityDiff;
        return b.level - a.level;
      });

    candidates.slice(0, count).forEach(u => {
      assignments.push({ userId: u.id, tacticalRole, source: 'auto' });
      usedIds.add(u.id);
    });
  });

  pool.forEach(u => {
    if (!usedIds.has(u.id)) {
      assignments.push({ userId: u.id, tacticalRole: 'Bench', source: 'auto' });
    }
  });

  return assignments;
}

// Precalcula asignaciones para las raids que ya nacen Locked/InProgress/Completed/Failed en el seed
function buildInitialAssignments(raids, users) {
  const map = {};
  raids.forEach(raid => {
    if (raid.state !== 'Planning') {
      map[raid.id] = assignRolesForRaid(raid, users);
    }
  });
  return map;
}

export function RaidProvider({ children }) {
  const [raids, setRaids] = useState(initialRaids);
  const [users, setUsers] = useState(initialUsers);
  const [failures, setFailures] = useState(initialFailures);
  const [raidAssignments, setRaidAssignments] = useState(() =>
    buildInitialAssignments(initialRaids, initialUsers)
  );

  const changeRaidState = (raidId, newState, userRole) => {
    setRaids(prev => prev.map(raid => {
      if (raid.id !== raidId) return raid;

      if (raid.state === "Planning" && newState === "Locked") {
        if (userRole === "Raid Leader" || userRole === "Officer") {
          setRaidAssignments(prevAssign => ({
            ...prevAssign,
            [raidId]: assignRolesForRaid(raid, users),
          }));
          return { ...raid, state: newState };
        }
      }

      if (raid.state === "Locked" && newState === "InProgress") {
        // TODO: siguiente paso — disparo automático al llegar startTime
        return { ...raid, state: newState };
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

  const overrideAssignment = (raidId, userId, newTacticalRole) => {
    setRaidAssignments(prev => {
      const current = prev[raidId] || [];
      const updated = current.map(a =>
        a.userId === userId ? { ...a, tacticalRole: newTacticalRole, source: 'manual' } : a
      );
      return { ...prev, [raidId]: updated };
    });
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
    <RaidContext.Provider value={{
      raids, users, failures, raidAssignments,
      changeRaidState, addFailure, overrideAssignment,
    }}>
      {children}
    </RaidContext.Provider>
  );
}