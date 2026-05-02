import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const navLinkClass = ({ isActive }) =>
  `rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out ${
    isActive ? 'bg-accent text-white' : 'text-textMuted hover:bg-accentSoft hover:text-accent'
  }`;

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-canvas text-textMain">
      <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-lg font-semibold">Team Task Manager</h1>
            <p className="text-xs text-textMuted">Calm planning for focused teams</p>
          </div>
          <nav className="flex items-center gap-2">
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/tasks" className={navLinkClass}>
              Task Management
            </NavLink>
            {user?.role === 'ADMIN' && (
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs uppercase tracking-wide text-textMuted">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="soft-button border border-slate-200 bg-white text-textMain hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
