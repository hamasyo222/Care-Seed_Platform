import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';

// Page Components
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LmsPage } from './pages/LmsPage';
import { TalentSearchPage } from './pages/TalentSearchPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { SupportChatPage } from './pages/SupportChatPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

// --- Protected Route Component with RBAC ---
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

// --- App Router ---
const router = createBrowserRouter([
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

// --- Main App Component ---
export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};