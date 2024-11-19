import { createBrowserRouter, RouterProvider, Navigate, Routes as ReactRoutes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import App from './App';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import AuthCallback from '@/pages/AuthCallback';
import ResetPassword from '@/pages/ResetPassword';
import WorkOrders from '@/pages/WorkOrders';
import WorkOrder from '@/components/WorkOrder';
import Customers from '@/pages/Customers';
import CustomerMachines from '@/pages/CustomerMachines';
import Inventory from '@/pages/Inventory';
import Settings from '@/pages/Settings';
import AdminSuite from '@/pages/AdminSuite';

export function Routes() {
  return (
    <AuthProvider>
      <ReactRoutes>
        <Route path="/" element={<App />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="auth/callback" element={<AuthCallback />} />
          <Route path="reset-password" element={<ResetPassword />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/work-orders" replace />} />
            <Route path="work-orders" element={<WorkOrders />} />
            <Route path="work-orders/new" element={<WorkOrder />} />
            <Route path="work-orders/:id" element={<WorkOrder />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customer-machines" element={<CustomerMachines />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="admin" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminSuite />
              </ProtectedRoute>
            } />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/work-orders" replace />} />
        </Route>
      </ReactRoutes>
    </AuthProvider>
  );
}