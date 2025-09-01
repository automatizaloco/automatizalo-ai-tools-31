import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAdminVerification } from '@/hooks/useAdminVerification';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Wrench, Settings, MessageSquare } from 'lucide-react';

const AdminLayoutSimple: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { isAdmin, isVerifying } = useAdminVerification();
  
  const currentPath = location.pathname.split('/')[2] || 'users';

  const adminTabs = [
    { id: 'users', label: 'Usuarios', icon: Users, path: '/admin/users' },
    { id: 'automations', label: 'Automatizaciones', icon: Settings, path: '/admin/automations' },
    { id: 'client-automations', label: 'Clientes', icon: Wrench, path: '/admin/client-automations' },
    { id: 'support', label: 'Soporte', icon: MessageSquare, path: '/admin/support' },
  ];

  const handleTabChange = (value: string) => {
    const tab = adminTabs.find(t => t.id === value);
    if (tab) {
      navigate(tab.path);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos de administrador.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-4">
        <Tabs value={currentPath} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {adminTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayoutSimple;