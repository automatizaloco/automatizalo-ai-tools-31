
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Blog from './pages/Blog.tsx'
import BlogPostForm from './pages/admin/BlogPostForm.tsx'
import BlogPost from './pages/BlogPost.tsx'
import NotFound from './pages/NotFound.tsx'
import { Toaster } from 'sonner'
import NotificationAdmin from "@/pages/admin/NotificationAdmin"
import Contact from './pages/Contact.tsx'
import WebhookManager from './pages/admin/WebhookManager.tsx'
import Index from './pages/Index.tsx'
import Layout from './components/layout/Layout.tsx'
import Admin from './pages/admin/Admin.tsx'
import ContentManager from './pages/admin/ContentManager.tsx'
import TestimonialManager from './pages/admin/TestimonialManager.tsx'
import AutomaticBlog from './pages/admin/AutomaticBlog.tsx'
import NewsletterAdmin from './pages/admin/NewsletterAdmin.tsx'
import ContentEditor from './pages/admin/ContentEditor.tsx'
import BlogAdmin from './pages/admin/BlogAdmin.tsx'
import Solutions from './pages/Solutions.tsx'
import PrivacyPolicy from './pages/PrivacyPolicy.tsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: "blog",
        element: <Blog />
      },
      {
        path: "blog/:slug",
        element: <BlogPost />
      },
      {
        path: "contact",
        element: <Contact />
      },
      {
        path: "solutions",
        element: <Solutions />
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin/content",
    element: <ContentManager />,
  },
  {
    path: "/admin/content-editor",
    element: <ContentEditor />,
  },
  {
    path: "/admin/blog",
    element: <BlogAdmin />,
  },
  {
    path: "/admin/blog/:id",
    element: <BlogPostForm />,
  },
  {
    path: "/admin/blog/new",
    element: <BlogPostForm />,
  },
  {
    path: "/admin/notifications",
    element: <NotificationAdmin />,
  },
  {
    path: "/admin/webhooks",
    element: <WebhookManager />,
  },
  {
    path: "/admin/testimonials",
    element: <TestimonialManager />,
  },
  {
    path: "/admin/automatic-blog",
    element: <AutomaticBlog />,
  },
  {
    path: "/admin/newsletter",
    element: <NewsletterAdmin />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster />
          </QueryClientProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
)
