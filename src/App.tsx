
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

import Index from "@/pages/Index";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Solutions from "@/pages/Solutions";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import BlogAdmin from "@/pages/admin/BlogAdmin";
import BlogPostForm from "@/pages/admin/BlogPostForm";
import ContentManager from "@/pages/admin/ContentManager";
import TestimonialManager from "@/pages/admin/TestimonialManager";
import WhatsAppButton from "@/components/common/WhatsAppButton";

import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                  <Route path="/solutions" element={<Solutions />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/blog" element={<BlogAdmin />} />
                  <Route path="/admin/blog/create" element={<BlogPostForm />} />
                  <Route path="/admin/blog/edit/:id" element={<BlogPostForm />} />
                  <Route path="/admin/content" element={<ContentManager />} />
                  <Route path="/admin/testimonials" element={<TestimonialManager />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <WhatsAppButton phoneNumber="1234567890" message="Hello, I'm interested in your AI solutions" />
                <Toaster position="bottom-right" />
              </Router>
            </TooltipProvider>
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
