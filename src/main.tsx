
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
import NotificationAdmin from "@/pages/admin/NotificationAdmin";
import Contact from './pages/Contact.tsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/:slug",
    element: <BlogPost />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/contact",
    element: <Contact />,
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
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/admin/notifications",
    element: <NotificationAdmin />,
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
