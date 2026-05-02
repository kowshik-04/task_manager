import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard.jsx';
import ProjectForm from '../components/ProjectForm.jsx';
import { fetchDashboardStats } from '../services/task.service.js';
import { createProject, deleteProject, fetchProjects } from '../services/project.service.js';
import { useAuth } from '../hooks/useAuth.jsx';

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, pendingTasks: 0, overdueTasks: 0 });
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, projectsRes] = await Promise.all([fetchDashboardStats(), fetchProjects()]);
      setStats(statsRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProject = async (payload) => {
    await createProject(payload);
    await loadData();
  };

  const handleDeleteProject = async (projectId) => {
    await deleteProject(projectId);
    await loadData();
  };

  if (loading) {
    return <p className="text-sm text-textMuted">Loading dashboard...</p>;
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Tasks" value={stats.totalTasks} />
        <StatCard title="Completed" value={stats.completedTasks} tone="success" />
        <StatCard title="Pending" value={stats.pendingTasks} tone="warning" />
        <StatCard title="Overdue" value={stats.overdueTasks} tone="danger" />
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {user?.role === 'ADMIN' && <ProjectForm onCreate={handleCreateProject} />}

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="mt-1 text-sm text-textMuted">Open a project to manage members and tasks.</p>

          <div className="mt-4 space-y-3">
            {projects.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                <p className="text-sm text-textMuted">No projects created yet. Click "Create Project" above to start.</p>
              </div>
            )}
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <button
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="text-left transition duration-200 hover:scale-[1.01]"
                >
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-textMuted">
                    {project._count.tasks} tasks • {project._count.members} members
                  </p>
                </button>

                {user?.role === 'ADMIN' && (
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="soft-button border border-slate-200 bg-white text-xs"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
