import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MemberManager from '../components/MemberManager.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';
import { addProjectMember, fetchProjectById, removeProjectMember } from '../services/project.service.js';
import { fetchUsers } from '../services/user.service.js';
import { createTask, updateTaskStatus } from '../services/task.service.js';
import { useAuth } from '../hooks/useAuth.jsx';

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const canManage = user?.role === 'ADMIN';

  const loadProject = async () => {
    setLoading(true);
    setError('');
    try {
      const projectRes = await fetchProjectById(projectId);
      setProject(projectRes.data);

      if (canManage) {
        const usersRes = await fetchUsers();
        setUsers(usersRes.data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const handleAddMember = async (userId) => {
    await addProjectMember(projectId, userId);
    await loadProject();
  };

  const handleRemoveMember = async (userId) => {
    await removeProjectMember(projectId, userId);
    await loadProject();
  };

  const handleCreateTask = async (payload) => {
    await createTask(payload);
    await loadProject();
  };

  const handleStatusChange = async (taskId, status) => {
    await updateTaskStatus(taskId, status);
    await loadProject();
  };

  if (loading) {
    return <p className="text-sm text-textMuted">Loading project...</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        <p>{error}</p>
        <Link to="/dashboard" className="mt-2 inline-block font-medium underline">
          Go back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold">{project.name}</h2>
        <p className="mt-1 text-sm text-textMuted">{project.description || 'No description provided.'}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <MemberManager
          members={project.members}
          users={users}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          canManage={canManage}
        />

        <TaskForm members={project.members} projectId={project.id} onCreateTask={handleCreateTask} canCreate={canManage} />
      </div>

      <div>
        <h3 className="mb-3 text-base font-semibold">Tasks</h3>
        <TaskList tasks={project.tasks} currentUser={user} onStatusChange={handleStatusChange} />
      </div>
    </section>
  );
}
