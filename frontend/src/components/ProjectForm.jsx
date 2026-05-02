import { useState } from 'react';

export default function ProjectForm({ onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await onCreate({ name, description });
      setName('');
      setDescription('');
      setSuccess('Project created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const message = err?.response?.data?.message || err?.userMessage || 'Unable to create project. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold">Create Project</h3>
      <div className="mt-4 grid gap-3">
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-sm text-emerald-700">{success}</p>
          </div>
        )}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          required
          disabled={loading}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition duration-200 focus:border-accent disabled:opacity-60"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={3}
          disabled={loading}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition duration-200 focus:border-accent disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading}
          className="soft-button bg-accent text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
