import { useState } from 'react';

export default function TaskForm({ members, projectId, onCreateTask, canCreate }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedToId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canCreate) return;

    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await onCreateTask({
        ...form,
        projectId,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
        assignedToId: form.assignedToId || undefined
      });
      setForm({ title: '', description: '', dueDate: '', assignedToId: '' });
      setSuccess('Task created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const message = err?.response?.data?.message || err?.userMessage || 'Unable to create task. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold">Create Task</h3>
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
          required
          value={form.title}
          onChange={(event) => handleChange('title', event.target.value)}
          placeholder="Task title"
          disabled={loading}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition duration-200 focus:border-accent disabled:opacity-60"
        />
        <textarea
          value={form.description}
          onChange={(event) => handleChange('description', event.target.value)}
          placeholder="Task description"
          rows={3}
          disabled={loading}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition duration-200 focus:border-accent disabled:opacity-60"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="datetime-local"
            value={form.dueDate}
            onChange={(event) => handleChange('dueDate', event.target.value)}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition duration-200 focus:border-accent disabled:opacity-60"
          />
          <select
            value={form.assignedToId}
            onChange={(event) => handleChange('assignedToId', event.target.value)}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition duration-200 focus:border-accent disabled:opacity-60"
          >
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.user.id} value={member.user.id}>
                {member.user.name}
              </option>
            ))}
          </select>
        </div>
        <button
          disabled={loading || !canCreate}
          className="soft-button bg-accent text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Saving...' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
