
import React, { useEffect, Suspense } from 'react';
import { Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import Index from './pages/Index';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Solutions from './pages/Solutions';
import Admin from './pages/admin/Admin';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/sonner';
import { PersistentToastProvider } from '@/context/PersistentToastContext';
import { AuthProvider } from '@/context/AuthContext';
import './App.css';
import './styles/blog-content.css';
import '@/components/editor/RichTextEditor.css';
import { LanguageProvider } from './context/LanguageContext';
import ContentManager from './pages/admin/ContentManager';
import TestimonialManager from './pages/admin/TestimonialManager';
import WebhookManager from './pages/admin/WebhookManager';
import BlogAdmin from './pages/admin/BlogAdmin';
import BlogPostForm from './pages/admin/BlogPostForm';
import NotificationAdmin from './pages/admin/NotificationAdmin';
import Unsubscribe from './pages/Unsubscribe';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NewsletterAdmin from './pages/admin/NewsletterAdmin';
import AutomaticBlog from './pages/admin/AutomaticBlog';
import ClientPortal from './pages/ClientPortal';
import UserManagement from './pages/admin/UserManagement';
import AutomationManager from './pages/admin/AutomationManager';
import SupportManager from './pages/admin/SupportManager';

const LazyLoadedRoute = ({ component: Component, ...rest }: { component: React.ComponentType<any>, [key: string]: any }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...rest} />
    </Suspense>
  );
};

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AuthProvider>
      <LanguageProvider>
        <PersistentToastProvider>
          <div className="app-wrapper">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="contact" element={<Contact />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<BlogPost />} />
                <Route path="solutions" element={<Solutions />} />
                <Route path="client-portal" element={<ClientPortal />} />
                <Route path="client-portal/support/new" element={<ClientPortal />} />
                <Route path="client-portal/support/:ticketId" element={<ClientPortal />} />
                <Route path="unsubscribe" element={<Unsubscribe />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              
              <Route path="/login" element={<Login />} />
              
              <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
                <Route index element={<Navigate to="/admin/content" replace />} />
                <Route path="content" element={<ContentManager />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="testimonials" element={<TestimonialManager />} />
                <Route path="webhooks" element={<WebhookManager />} />
                <Route path="blog" element={<BlogAdmin />} />
                <Route path="blog/new" element={<BlogPostForm />} />
                <Route path="blog/edit/:id" element={<BlogPostForm />} />
                <Route path="newsletters" element={<NewsletterAdmin />} />
                <Route path="notifications" element={<NotificationAdmin />} />
                <Route path="automatic-blog" element={<AutomaticBlog />} />
                <Route path="automations" element={<AutomationManager />} />
                <Route path="support" element={<SupportManager />} />
              </Route>
            </Routes>
            <Toaster />
          </div>
        </PersistentToastProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
