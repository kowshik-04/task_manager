import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/auth.service.js';
import { useAuth } from '../hooks/useAuth.jsx';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await signup(form);
      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-1 text-sm text-textMuted">Start organizing projects and tasks with your team</p>

        <div className="mt-6 space-y-3">
          <input
            value={form.name}
            onChange={(event) => setField('name', event.target.value)}
            placeholder="Full name"
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition duration-200 focus:border-accent"
          />
          <input
            type="email"
            value={form.email}
            onChange={(event) => setField('email', event.target.value)}
            placeholder="Email"
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition duration-200 focus:border-accent"
          />
          <input
            type="password"
            value={form.password}
            onChange={(event) => setField('password', event.target.value)}
            placeholder="Password"
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition duration-200 focus:border-accent"
          />
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-textMuted">
            New accounts are created as members. Admin access is available through seeded demo users.
          </p>
        </div>

        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="soft-button mt-5 w-full bg-accent text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Creating...' : 'Signup'}
        </button>

        <p className="mt-4 text-center text-sm text-textMuted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
