
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import AdminLayoutSimple from './components/layout/AdminLayoutSimple';

/* Admin routes only - simplified backend interface */
const SupportManager = lazy(() => import('./pages/admin/SupportManager'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const WebhookManager = lazy(() => import('./pages/admin/WebhookManager'));
const AutomationManager = lazy(() => import('./pages/admin/AutomationManager'));
const ClientAutomationsManager = lazy(() => import('./pages/admin/ClientAutomationsManager'));

function App() {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          {/* Redirect root to admin dashboard */}
          <Route path="/" element={<Navigate to="/admin/users" replace />} />
          
          <Route path="/admin" element={<AdminLayoutSimple />}>
            <Route index element={<Navigate to="/admin/users" replace />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="support" element={<SupportManager />} />
            <Route path="webhooks" element={<WebhookManager />} />
            <Route path="automations" element={<AutomationManager />} />
            <Route path="client-automations" element={<ClientAutomationsManager />} />
          </Route>
          
          {/* Catch all routes and redirect to admin */}
          <Route path="*" element={<Navigate to="/admin/users" replace />} />
        </Routes>
      </Suspense>
      <Toaster closeButton position="bottom-right" />
    </>
  );
}

export default App;
