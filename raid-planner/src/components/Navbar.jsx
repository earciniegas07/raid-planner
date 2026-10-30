import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const tabClass = ({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h2 className="nav-brand">Raid<span>Planner</span></h2>
      {user && (
        <>
          <div className="nav-tabs">
            <NavLink to="/clans" className={tabClass}>Clanes</NavLink>
            <NavLink to="/raids" className={tabClass}>Raids</NavLink>
            <NavLink to="/hall" className={tabClass}>Hall of Shame</NavLink>
          </div>
          <div className="nav-user">
            <small>{user.gamertag} · {user.role}</small>
            <button className="btn" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </>
      )}
    </nav>
  );
}