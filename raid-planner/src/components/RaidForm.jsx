import { useState } from 'react';

const DIFFICULTIES = ['Normal', 'Heroic', 'Mythic', 'Impossible'];
const ROLES = ['Tank', 'Healer', 'DPS', 'Support'];

const toLocalInput = (iso) => {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const buildInitial = (initial, clans) => ({
  name: initial?.name ?? '',
  difficulty: initial?.difficulty ?? 'Normal',
  startTime: initial ? toLocalInput(initial.startTime) : '',
  durationHours: initial?.durationHours ?? 2,
  minPlayers: initial?.minPlayers ?? 10,
  maxPlayers: initial?.maxPlayers ?? 20,
  clanId: initial?.clanId?._id ?? clans[0]?._id ?? '',
  roles: ROLES.reduce((acc, r) => ({ ...acc, [r]: initial?.requiredRoles?.[r] ?? 0 }), {}),
});

export function RaidForm({ clans, initial = null, submitLabel = 'Crear raid', onSubmit, onCancel }) {
  const [form, setForm] = useState(() => buildInitial(initial, clans));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleRole = (role, value) => setForm({ ...form, roles: { ...form.roles, [role]: value } });

  const validate = () => {
    const min = Number(form.minPlayers);
    const max = Number(form.maxPlayers);
    const totalRoles = ROLES.reduce((sum, r) => sum + Number(form.roles[r] || 0), 0);
    if (!form.name.trim()) return 'El nombre de la raid es obligatorio';
    if (!form.clanId) return 'Debes elegir un clan';
    if (!form.startTime) return 'Indica la fecha y hora de inicio';
    if (!(Number(form.durationHours) > 0)) return 'La duración debe ser mayor a 0 horas';
    if (!Number.isInteger(min) || !Number.isInteger(max) || min < 1) return 'Los límites de jugadores deben ser enteros positivos';
    if (min > max) return 'El mínimo de jugadores no puede superar al máximo';
    if (totalRoles === 0) return 'Define al menos un rol requerido';
    if (totalRoles > max) return 'Los roles requeridos superan el máximo de jugadores';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    setSubmitting(true);
    const requiredRoles = {};
    ROLES.forEach((r) => { if (Number(form.roles[r]) > 0) requiredRoles[r] = Number(form.roles[r]); });
    const ok = await onSubmit({
      name: form.name.trim(),
      difficulty: form.difficulty,
      startTime: new Date(form.startTime).toISOString(),
      durationHours: Number(form.durationHours),
      minPlayers: Number(form.minPlayers),
      maxPlayers: Number(form.maxPlayers),
      clanId: form.clanId,
      requiredRoles,
    });
    setSubmitting(false);
    if (ok && !initial) setForm(buildInitial(null, clans));
  };

  return (
    <form onSubmit={handleSubmit} className="form-panel" noValidate>
      <h3>{initial ? 'Editar raid' : 'Nueva raid'}</h3>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="raid-name">Nombre</label>
          <input id="raid-name" name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="raid-clan">Clan</label>
          <select id="raid-clan" name="clanId" value={form.clanId} onChange={handleChange}>
            {clans.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="raid-diff">Dificultad</label>
          <select id="raid-diff" name="difficulty" value={form.difficulty} onChange={handleChange}>
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="raid-start">Inicio</label>
          <input id="raid-start" name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="raid-duration">Duración (horas)</label>
          <input id="raid-duration" name="durationHours" type="number" min="1" step="0.5" value={form.durationHours} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="raid-min">Mín. jugadores</label>
          <input id="raid-min" name="minPlayers" type="number" min="1" value={form.minPlayers} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="raid-max">Máx. jugadores</label>
          <input id="raid-max" name="maxPlayers" type="number" min="1" value={form.maxPlayers} onChange={handleChange} />
        </div>
      </div>

      <fieldset className="roles-fieldset">
        <legend>Roles requeridos</legend>
        <div className="form-grid">
          {ROLES.map((r) => (
            <div className="field" key={r}>
              <label htmlFor={`role-${r}`}>{r}</label>
              <input id={`role-${r}`} type="number" min="0" value={form.roles[r]} onChange={(e) => handleRole(r, e.target.value)} />
            </div>
          ))}
        </div>
      </fieldset>

      <div className="form-row">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Guardando...' : submitLabel}
        </button>
        {onCancel && <button type="button" className="btn" onClick={onCancel}>Cancelar</button>}
      </div>
      {error && <div className="form-feedback error">{error}</div>}
    </form>
  );
}
