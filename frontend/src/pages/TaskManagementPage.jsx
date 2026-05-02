import { useEffect, useState } from 'react';
import TaskList from '../components/TaskList.jsx';
import { fetchProjects, fetchProjectTasks } from '../services/project.service.js';
import { updateTaskStatus } from '../services/task.service.js';
import { useAuth } from '../hooks/useAuth.jsx';

export default function TaskManagementPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  const loadProjects = async () => {
    try {
      const response = await fetchProjects();
      setProjects(response.data);
      if (response.data.length > 0) {
        setSelectedProjectId(response.data[0].id);
        setError('');
      } else {
        setSelectedProjectId('');
        setTasks([]);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load projects');
    }
  };

  const loadTasks = async (projectId) => {
    if (!projectId) return;
    try {
      const response = await fetchProjectTasks(projectId);
      setTasks(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load tasks');
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    loadTasks(selectedProjectId);
  }, [selectedProjectId]);

  const handleStatusChange = async (taskId, status) => {
    await updateTaskStatus(taskId, status);
    await loadTasks(selectedProjectId);
  };

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Task Management</h2>
        <p className="mt-1 text-sm text-textMuted">Track tasks by project and update progress quickly.</p>

        <select
          value={selectedProjectId}
          onChange={(event) => setSelectedProjectId(event.target.value)}
          className="mt-4 w-full max-w-sm rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition duration-200 focus:border-accent"
        >
          {projects.length === 0 && <option value="">No projects available</option>}
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      {projects.length === 0 && !error && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-textMuted shadow-sm">
          No projects yet.
        </div>
      )}

      <TaskList tasks={tasks} currentUser={user} onStatusChange={handleStatusChange} />
    </section>
  );
}
