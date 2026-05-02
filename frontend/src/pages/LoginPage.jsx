import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth.service.js';
import { useAuth } from '../hooks/useAuth.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login({ email, password });
      setAuth(response.data);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.userMessage || 'Unable to sign in. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-textMuted">Login to continue managing team tasks</p>

        <div className="mt-6 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition duration-200 focus:border-accent"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition duration-200 focus:border-accent"
          />
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3">
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="soft-button mt-5 w-full bg-accent text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p className="mt-4 text-center text-sm text-textMuted">
          New here?{' '}
          <Link to="/signup" className="font-medium text-accent">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}
