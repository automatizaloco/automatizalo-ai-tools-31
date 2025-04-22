
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
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
import { AuthProvider } from '@/context/AuthProvider';
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

function App() {
  const location = useLocation();

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AuthProvider>
      <LanguageProvider>
        <PersistentToastProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="contact" element={<Contact />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="solutions" element={<Solutions />} />
              <Route path="unsubscribe" element={<Unsubscribe />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            
            <Route path="/login" element={<Login />} />
            
            <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
              <Route index element={<Admin />} />
              <Route path="content" element={<ContentManager />} />
              <Route path="testimonials" element={<TestimonialManager />} />
              <Route path="webhooks" element={<WebhookManager />} />
              <Route path="newsletters" element={<NewsletterAdmin />} />
              <Route path="blog" element={<BlogAdmin />} />
              <Route path="blog/new" element={<BlogPostForm />} />
              <Route path="blog/edit/:id" element={<BlogPostForm />} />
              <Route path="notifications" element={<NotificationAdmin />} />
            </Route>
          </Routes>
          <Toaster />
        </PersistentToastProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
