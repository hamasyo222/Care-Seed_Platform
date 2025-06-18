import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
// import { useAuthStore } from './store/auth.store'; // 実際のパスに修正

// --- Page Components ---
// import { LoginPage } from './features/auth/LoginPage';
// import { DashboardPage } from './pages/DashboardPage';
// import { AdminDashboardPage } from './pages/AdminDashboardPage';
// import { UnauthorizedPage } from './pages/UnauthorizedPage';

// このデモではコンポーネントを仮定義します
const LoginPage = () => <div>Login Page</div>;
const DashboardPage = () => <div>Dashboard Page</div>;
const AdminDashboardPage = () => <div>Admin Dashboard</div>;
const UnauthorizedPage = () => <div>Unauthorized</div>;
const useAuthStore = () => ({ isAuthenticated: true, user: { roles: ['admin'] } }); // モック

// --- Role-Based Access Control (RBAC)を持つ保護ルート ---
const ProtectedRoute: React.FC<{ allowedRoles?: string[] }> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const userRoles = user?.roles || [];
  const hasRequiredRole = allowedRoles ? allowedRoles.some(role => userRoles.includes(role)) : true;

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      // ...他のユーザー向けルート
      { 
        path: 'admin',
        element: <ProtectedRoute allowedRoles={['admin', 'platform_admin']} />,
        children: [
            { path: 'dashboard', element: <AdminDashboardPage /> }
        ]
      },
    ],
  },
]);