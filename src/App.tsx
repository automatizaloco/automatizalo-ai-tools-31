
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/sonner';
import Layout from '@/components/layout/Layout';
import Index from '@/pages/Index';
import Solutions from '@/pages/Solutions';
import Contact from '@/pages/Contact';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import AdminLayout from '@/components/layout/AdminLayout';
import ContentManager from '@/pages/admin/ContentManager';
import BlogAdmin from '@/pages/admin/BlogAdmin';
import BlogPostForm from '@/pages/admin/BlogPostForm';
import LayoutManager from '@/pages/admin/LayoutManager';
import ContentEditor from '@/pages/admin/ContentEditor';
import TestimonialManager from '@/pages/admin/TestimonialManager';
import NewsletterAdmin from '@/pages/admin/NewsletterAdmin';
import Unsubscribe from '@/pages/Unsubscribe';

import { useContactInfo } from '@/stores/contactInfoStore';

import './App.css';

function AppContent() {
  const location = useLocation();
  const { fetchContactInfo } = useContactInfo();

  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <Toaster position="top-right" />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<ContentManager />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="content/:id" element={<ContentEditor />} />
            <Route path="blog" element={<BlogAdmin />} />
            <Route path="blog/new" element={<BlogPostForm />} />
            <Route path="blog/edit/:id" element={<BlogPostForm />} />
            <Route path="layout" element={<LayoutManager />} />
            <Route path="testimonials" element={<TestimonialManager />} />
            <Route path="newsletter" element={<NewsletterAdmin />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
