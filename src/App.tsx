
import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "@/pages/Index";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Solutions from "@/pages/Solutions";
import Login from "@/pages/Login";
import ContentManager from "@/pages/admin/ContentManager";
import BlogAdmin from "@/pages/admin/BlogAdmin";
import BlogPostForm from "@/pages/admin/BlogPostForm";
import TestimonialManager from "@/pages/admin/TestimonialManager";
import NewsletterAdmin from "@/pages/admin/NewsletterAdmin";
import ContentEditor from "@/pages/admin/ContentEditor";
import LayoutManager from "@/pages/admin/LayoutManager";
import NotFound from "@/pages/NotFound";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
          toast.error('An error occurred while fetching data');
        }
      }
    }
  }
});

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme === "dark" ? "dark" : "light");
    } else {
      // Detect system preference on initial load
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme={theme}>
          <LanguageProvider>
            <BrowserRouter>
              <WhatsAppButton />
              <Toaster />
              
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/login" element={<Login />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<ContentManager />} />
                <Route path="/admin/blog" element={<BlogAdmin />} />
                <Route path="/admin/blog/new" element={<BlogPostForm />} />
                <Route path="/admin/blog/edit/:id" element={<BlogPostForm />} />
                <Route path="/admin/testimonials" element={<TestimonialManager />} />
                <Route path="/admin/newsletter" element={<NewsletterAdmin />} />
                <Route path="/admin/content-editor" element={<ContentEditor />} />
                <Route path="/admin/layout-manager" element={<LayoutManager />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
