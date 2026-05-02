import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProjectDetailsPage from './pages/ProjectDetailsPage.jsx';
import TaskManagementPage from './pages/TaskManagementPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import { useAuth } from './hooks/useAuth.jsx';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AuthRedirectRoute = ({ children }) => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthRedirectRoute>
            <LoginPage />
          </AuthRedirectRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRedirectRoute>
            <SignupPage />
          </AuthRedirectRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
        <Route path="tasks" element={<TaskManagementPage />} />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
