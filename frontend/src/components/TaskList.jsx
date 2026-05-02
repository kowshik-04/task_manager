import { useState } from 'react';

const statusOptions = ['TODO', 'IN_PROGRESS', 'DONE'];

const statusStyle = {
  TODO: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-emerald-100 text-emerald-700'
};

export default function TaskList({ tasks, currentUser, onStatusChange }) {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleStatusChange = async (taskId, newStatus) => {
    setError('');
    setSuccess('');
    setLoading((prev) => ({ ...prev, [taskId]: true }));
    try {
      await onStatusChange(taskId, newStatus);
      setSuccess('Task updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const message = err?.response?.data?.message || err?.userMessage || 'Unable to update task. Please try again.';
      setError(message);
    } finally {
      setLoading((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  if (!tasks.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center shadow-sm">
        <p className="text-sm text-textMuted">No tasks yet. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
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
      {tasks.map((task) => {
        const canEditStatus =
          currentUser?.role === 'ADMIN' || (currentUser?.role === 'MEMBER' && task.assignedToId === currentUser.id);

        return (
          <article
            key={task.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 ease-in-out hover:scale-[1.02]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold">{task.title}</h4>
                <p className="mt-1 text-sm text-textMuted">{task.description || 'No description'}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle[task.status]}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-textMuted sm:grid-cols-3">
              <p>
                Assignee: <span className="font-medium text-textMain">{task.assignee?.name || 'Unassigned'}</span>
              </p>
              <p>
                Due:{' '}
                <span className="font-medium text-textMain">
                  {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No due date'}
                </span>
              </p>
              <div className="sm:text-right">
                {canEditStatus ? (
                  <select
                    value={task.status}
                    onChange={(event) => handleStatusChange(task.id, event.target.value)}
                    disabled={loading[task.id]}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none transition duration-200 focus:border-accent disabled:opacity-60"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs">Status editable only by assignee/admin</span>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
