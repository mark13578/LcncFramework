// src/routes/AppRouter.tsx
import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute'; // <-- 引用 ProtectedRoute

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    // ↓↓ 修改這裡，將 DashboardPage 包起來 ↓↓
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
]);

export default router;