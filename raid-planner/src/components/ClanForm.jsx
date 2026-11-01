import { useState } from 'react';

const FACTIONS = ['Horde', 'Alliance', 'Neutral'];
const CLASSES = ['Tank', 'Healer', 'DPS', 'Support'];

const buildInitial = (initial) => ({
  name: initial?.name ?? '',
  faction: initial?.faction ?? 'Neutral',
  description: initial?.description ?? '',
  banner: initial?.banner ?? '',
  limits: CLASSES.reduce((acc, c) => ({ ...acc, [c]: initial?.roleLimits?.[c] ?? '' }), {}),
});

export function ClanForm({ initial = null, submitLabel = 'Crear clan', onSubmit, onCancel }) {
  const [form, setForm] = useState(() => buildInitial(initial));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleLimit = (cls, value) => setForm({ ...form, limits: { ...form.limits, [cls]: value } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('El nombre del clan es obligatorio');
      return;
    }
    const roleLimits = {};
    for (const c of CLASSES) {
      const raw = form.limits[c];
      if (raw === '' || raw === null) {
        roleLimits[c] = null;
        continue;
      }
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 0) {
        setError(`El cupo de ${c} debe ser un entero mayor o igual a 0 (o vacío para ilimitado)`);
        return;
      }
      roleLimits[c] = n;
    }
    setError('');
    setSubmitting(true);
    const ok = await onSubmit({
      name: form.name.trim(),
      faction: form.faction,
      description: form.description.trim(),
      banner: form.banner.trim(),
      roleLimits,
    });
    setSubmitting(false);
    if (ok && !initial) setForm(buildInitial(null));
  };

  return (
    <form onSubmit={handleSubmit} className="form-panel" noValidate>
      <h3>{initial ? 'Editar clan' : 'Nuevo clan'}</h3>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="clan-name">Nombre</label>
          <input id="clan-name" name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="clan-faction">Facción</label>
          <select id="clan-faction" name="faction" value={form.faction} onChange={handleChange}>
            {FACTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="clan-banner">Banner (URL, opcional)</label>
          <input id="clan-banner" name="banner" value={form.banner} onChange={handleChange} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="clan-desc">Descripción</label>
        <textarea id="clan-desc" name="description" rows={2} value={form.description} onChange={handleChange} />
      </div>

      <fieldset className="roles-fieldset">
        <legend>Cupo máximo por clase (vacío = ilimitado)</legend>
        <div className="form-grid">
          {CLASSES.map((c) => (
            <div className="field" key={c}>
              <label htmlFor={`limit-${c}`}>{c}</label>
              <input id={`limit-${c}`} type="number" min="0" value={form.limits[c]} onChange={(e) => handleLimit(c, e.target.value)} />
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
