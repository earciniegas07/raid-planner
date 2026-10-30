import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

const CLASSES = ['Tank', 'Healer', 'DPS', 'Support'];
const REGIONS = ['SA', 'NA', 'EU'];

export function RegisterPage() {
  const { user, register } = useAuth();
  const [form, setForm] = useState({
    username: '', email: '', password: '', gamertag: '', class: 'Tank', region: 'SA', level: 1,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/raids" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.username.trim() || !form.gamertag.trim()) return 'Usuario y gamertag son obligatorios';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Ingresa un email válido';
    if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    const level = Number(form.level);
    if (!Number.isInteger(level) || level < 1 || level > 100) return 'El nivel debe estar entre 1 y 100';
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
    try {
      await register({
        ...form,
        username: form.username.trim(),
        email: form.email.trim(),
        gamertag: form.gamertag.trim(),
        level: Number(form.level),
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form onSubmit={handleSubmit} className="form-panel auth-card">
        <h3>Crear cuenta</h3>
        <div className="field">
          <label htmlFor="username">Usuario</label>
          <input id="username" name="username" value={form.username} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="gamertag">Gamertag</label>
          <input id="gamertag" name="gamertag" value={form.gamertag} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="class">Clase</label>
          <select id="class" name="class" value={form.class} onChange={handleChange}>
            {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="region">Región</label>
          <select id="region" name="region" value={form.region} onChange={handleChange}>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="level">Nivel</label>
          <input id="level" name="level" type="number" min="1" max="100" value={form.level} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creando cuenta...' : 'Registrarme'}
        </button>
        {error && <div className="form-feedback error">{error}</div>}
        <p style={{ marginTop: 14, fontSize: 13 }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}