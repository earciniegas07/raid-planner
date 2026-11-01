import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

export const RaidContext = createContext(null);
export const useRaids = () => useContext(RaidContext);

const EMPTY_RANKINGS = { mostReliable: [], recentFailures: [] };

export function RaidProvider({ children }) {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const userId = user?.id;

  const [raids, setRaids] = useState([]);
  const [users, setUsers] = useState([]);
  const [clans, setClans] = useState([]);
  const [rankings, setRankings] = useState(EMPTY_RANKINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(0);

  const loadAll = useCallback(async () => {
    try {
      const [r, u, c, k] = await Promise.all([
        api.get('/raids'),
        api.get('/users'),
        api.get('/clans'),
        api.get('/raids/rankings/all'),
      ]);
      setRaids(r.data);
      setUsers(u.data);
      setClans(c.data);
      setRankings(k.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial cuando hay sesión; limpia todo al cerrar sesión
  useEffect(() => {
    if (!userId) {
      setRaids([]); setUsers([]); setClans([]); setRankings(EMPTY_RANKINGS);
      return;
    }
    setLoading(true);
    loadAll();
  }, [userId, loadAll]);

  // Ejecuta una mutación, refresca los datos y avisa al usuario. Devuelve true/false.
  const act = useCallback(async (request, okMessage) => {
    setPending((n) => n + 1);
    try {
      const res = await request();
      await loadAll();
      if (okMessage) toast('success', typeof okMessage === 'function' ? okMessage(res.data) : okMessage);
      return true;
    } catch (err) {
      toast('error', getErrorMessage(err));
      return false;
    } finally {
      setPending((n) => n - 1);
    }
  }, [loadAll, toast]);

  const actions = useMemo(() => ({
    // Raids
    createRaid: (payload) => act(() => api.post('/raids', payload), 'Raid creada'),
    updateRaid: (id, payload) => act(() => api.put(`/raids/${id}`, payload), 'Raid actualizada'),
    deleteRaid: (id) => act(() => api.delete(`/raids/${id}`), 'Raid eliminada'),
    changeRaidState: (id, newState) =>
      act(() => api.patch(`/raids/${id}/state`, { newState }), `Raid en estado ${newState}`),
    overrideAssignment: (raidId, targetUserId, tacticalRole) =>
      act(() => api.patch(`/raids/${raidId}/assignments/${targetUserId}`, { tacticalRole }), 'Rol reasignado'),
    addFailure: (raidId, targetUserId, type, severity) =>
      act(
        () => api.post(`/raids/${raidId}/failures`, { userId: targetUserId, type, severity }),
        (d) => (d?.benched ? 'Fallo registrado: el jugador pasa a Bench (8+ puntos)' : 'Fallo registrado')
      ),
    checkIn: (raidId) => act(() => api.patch(`/raids/${raidId}/checkin`), 'Check-in registrado'),
    checkOut: (raidId) => act(() => api.patch(`/raids/${raidId}/checkout`), 'Checkout registrado'),
    // Clanes
    createClan: (payload) => act(() => api.post('/clans', payload), 'Clan creado'),
    updateClan: (id, payload) => act(() => api.put(`/clans/${id}`, payload), 'Clan actualizado'),
    deleteClan: (id) => act(() => api.delete(`/clans/${id}`), 'Clan eliminado'),
    joinClan: async (id) => {
      const ok = await act(() => api.post(`/clans/${id}/join`), 'Te uniste al clan');
      if (ok) await refreshUser();
      return ok;
    },
  }), [act, refreshUser]);

  return (
    <RaidContext.Provider
      value={{ raids, users, clans, rankings, loading, error, busy: pending > 0, reload: loadAll, ...actions }}
    >
      {children}
    </RaidContext.Provider>
  );
}
