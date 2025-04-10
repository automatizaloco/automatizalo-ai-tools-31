import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

const WebhookManager = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Webhook Manager</h1>
        <p className="text-gray-600 mb-6">
          Configure and manage webhooks for your application.
        </p>
        
        {/* Webhook content here */}
      </div>
    </AdminLayout>
  );
};

export default WebhookManager;
