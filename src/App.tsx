
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

import Index from "@/pages/Index";
import Blog from "@/pages/Blog";
import Solutions from "@/pages/Solutions";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import BlogAdmin from "@/pages/admin/BlogAdmin";
import BlogPostForm from "@/pages/admin/BlogPostForm";
import ContentManager from "@/pages/admin/ContentManager";

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
          <TooltipProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/blog" element={<BlogAdmin />} />
                <Route path="/admin/blog/new" element={<BlogPostForm />} />
                <Route path="/admin/blog/edit/:id" element={<BlogPostForm />} />
                <Route path="/admin/content" element={<ContentManager />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster position="bottom-right" />
            </Router>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
