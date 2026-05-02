import { useMemo, useState } from 'react';

export default function MemberManager({ members, users, onAddMember, onRemoveMember, canManage }) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const selectableUsers = useMemo(() => {
    const memberIds = new Set(members.map((member) => member.userId));
    return users.filter((user) => !memberIds.has(user.id));
  }, [members, users]);

  const handleAdd = async () => {
    if (!selectedUserId) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await onAddMember(selectedUserId);
      setSelectedUserId('');
      setSuccess('Member added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const message = err?.response?.data?.message || err?.userMessage || 'Unable to add member. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold">Project Members</h3>
      {error && (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3">
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-sm text-emerald-700">{success}</p>
        </div>
      )}
      {members.length === 0 && !canManage && (
        <p className="mt-3 text-sm text-textMuted">No members added yet.</p>
      )}
      <div className="mt-4 space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium">{member.user.name}</p>
              <p className="text-xs text-textMuted">{member.user.email}</p>
            </div>
            {canManage && (
              <button
                onClick={() => onRemoveMember(member.userId)}
                className="soft-button border border-slate-200 bg-white text-xs text-textMain"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {canManage && (
        <div className="mt-4 flex gap-2">
          <select
            value={selectedUserId}
            onChange={(event) => setSelectedUserId(event.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition duration-200 focus:border-accent disabled:opacity-60"
          >
            <option value="">Select user to add</option>
            {selectableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="soft-button bg-accent text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? '...' : 'Add'}
          </button>
        </div>
      )}
    </section>
  );
}
