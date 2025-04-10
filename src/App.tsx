import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import { PersistentToastProvider } from "@/context/PersistentToastContext";

// Import your pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import BlogList from '@/pages/blog/BlogList';
import BlogPost from '@/pages/blog/BlogPost';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminBlogList from '@/pages/admin/AdminBlogList';
import BlogPostForm from '@/pages/admin/BlogPostForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <QueryClientProvider client={queryClient}>
            <PersistentToastProvider>
              <Router>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/blog" element={<BlogList />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Admin routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/blog" 
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminBlogList />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/blog/new" 
                    element={
                      <ProtectedRoute adminOnly>
                        <BlogPostForm />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/blog/edit/:id" 
                    element={
                      <ProtectedRoute adminOnly>
                        <BlogPostForm />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
              <Toaster />
            </PersistentToastProvider>
          </QueryClientProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
