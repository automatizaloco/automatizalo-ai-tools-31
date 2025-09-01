
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import AdminLayoutSimple from './components/layout/AdminLayoutSimple';
import Login from './pages/Login';

/* Admin and Client routes */
const SupportManager = lazy(() => import('./pages/admin/SupportManager'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const AutomationManager = lazy(() => import('./pages/admin/AutomationManager'));
const ClientAutomationsManager = lazy(() => import('./pages/admin/ClientAutomationsManager'));
const ClientPortal = lazy(() => import('./pages/ClientPortal'));

function App() {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          {/* Main login page */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayoutSimple />}>
            <Route index element={<Navigate to="/admin/users" replace />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="support" element={<SupportManager />} />
            <Route path="automations" element={<AutomationManager />} />
            <Route path="client-automations" element={<ClientAutomationsManager />} />
          </Route>
          
          {/* Client portal routes */}
          <Route path="/client-portal" element={<ClientPortal />} />
          <Route path="/client-portal/:view" element={<ClientPortal />} />
          <Route path="/client-portal/:view/:ticketId" element={<ClientPortal />} />
          <Route path="/client-portal/:view/:automationId" element={<ClientPortal />} />
          
          {/* Catch all routes and redirect to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster closeButton position="bottom-right" />
    </>
  );
}

export default App;
