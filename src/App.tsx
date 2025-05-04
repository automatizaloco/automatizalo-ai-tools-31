import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

/* Public routes */
const Layout = lazy(() => import('./components/layout/Layout'));
const Index = lazy(() => import('./pages/Index'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Unsubscribe = lazy(() => import('./pages/Unsubscribe'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const NotFound = lazy(() => import('./pages/NotFound'));

/* Client portal routes */
const ClientPortal = lazy(() => import('./pages/client/ClientPortal'));

/* Admin routes */
const AdminBaseLayout = lazy(() => import('./pages/admin/layout/AdminBaseLayout'));
const Admin = lazy(() => import('./pages/admin/Admin'));
const AutomaticBlog = lazy(() => import('./pages/admin/AutomaticBlog'));
const BlogAdmin = lazy(() => import('./pages/admin/BlogAdmin'));
const BlogPostForm = lazy(() => import('./pages/admin/BlogPostForm'));
const ContentEditor = lazy(() => import('./pages/admin/ContentEditor'));
const ContentManager = lazy(() => import('./pages/admin/ContentManager'));
const LayoutManager = lazy(() => import('./pages/admin/LayoutManager'));
const NewsletterAdmin = lazy(() => import('./pages/admin/NewsletterAdmin'));
const NotificationAdmin = lazy(() => import('./pages/admin/NotificationAdmin'));
const SupportManager = lazy(() => import('./pages/admin/SupportManager'));
const TestimonialManager = lazy(() => import('./pages/admin/TestimonialManager'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const WebhookManager = lazy(() => import('./pages/admin/WebhookManager'));
const AutomationManager = lazy(() => import('./pages/admin/AutomationManager'));
const ClientAutomationsManager = lazy(() => import('./pages/admin/ClientAutomationsManager'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="solutions" element={<Solutions />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="unsubscribe" element={<Unsubscribe />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            
            <Route path="client-portal" element={<ClientPortal />} />
            
            <Route path="*" element={<NotFound />} />
          </Route>
          
          <Route path="/admin" element={<AdminBaseLayout />}>
            <Route index element={<Admin />} />
            <Route path="blog" element={<BlogAdmin />} />
            <Route path="blog/new" element={<BlogPostForm />} />
            <Route path="blog/edit/:id" element={<BlogPostForm />} />
            <Route path="blog/automatic" element={<AutomaticBlog />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="content/:page" element={<ContentEditor />} />
            <Route path="layout" element={<LayoutManager />} />
            <Route path="newsletter" element={<NewsletterAdmin />} />
            <Route path="notifications" element={<NotificationAdmin />} />
            <Route path="support" element={<SupportManager />} />
            <Route path="testimonials" element={<TestimonialManager />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="webhooks" element={<WebhookManager />} />
            <Route path="automations" element={<AutomationManager />} />
            <Route path="client-automations" element={<ClientAutomationsManager />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster closeButton position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
