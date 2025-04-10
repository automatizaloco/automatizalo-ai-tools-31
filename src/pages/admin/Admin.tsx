
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

const Admin = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome to the admin dashboard. Select a section from the tabs above to manage your content.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Content Management</h2>
            <p className="text-gray-600 mb-4">Manage your website content, blog posts, and layout.</p>
            <a href="/admin/blog" className="text-blue-500 hover:underline">Manage Blog Posts →</a>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Webhook Configuration</h2>
            <p className="text-gray-600 mb-4">Configure webhook settings for blog creation and social sharing.</p>
            <a href="/admin/webhooks" className="text-blue-500 hover:underline">Configure Webhooks →</a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
