import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Admin from './pages/Admin.tsx'
import Blog from './pages/Blog.tsx'
import BlogPostForm from './pages/admin/BlogPostForm.tsx'
import BlogPosts from './pages/admin/BlogPosts.tsx'
import EditProfile from './pages/EditProfile.tsx'
import Home from './pages/Home.tsx'
import Pricing from './pages/Pricing.tsx'
import Contact from './pages/Contact.tsx'
import BlogPost from './pages/BlogPost.tsx'
import NotFound from './pages/NotFound.tsx'
import { Toaster } from 'sonner'
import NotificationAdmin from "@/pages/admin/NotificationAdmin";

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/contact",
    element: <Contact />,
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
    path: "/edit-profile",
    element: <EditProfile />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin/blog",
    element: <BlogPosts />,
  },
  {
    path: "/admin/blog/new",
    element: <BlogPostForm />,
  },
  {
    path: "/admin/blog/:id",
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
