import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/auth.store'; // パスはプロジェクト構成に合わせる

// Page Components
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LmsPage } from './pages/LmsPage';
import { TalentSearchPage } from './pages/TalentSearchPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { SupportChatPage } from './pages/SupportChatPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

// Role-Based Access Controlを持つ保護ルート
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
      { path: 'lms', element: <LmsPage /> },
      { path: 'matching/search', element: <TalentSearchPage /> },
      { path: 'projects/:projectId', element: <ProjectDetailPage /> },
      { path: 'support/chat', element: <SupportChatPage /> },
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