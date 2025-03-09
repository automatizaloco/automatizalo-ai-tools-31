
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  const navItems = [
    { title: t('nav.home'), path: '/' },
    { title: t('nav.solutions'), path: '/solutions' },
    { title: t('nav.blog'), path: '/blog' },
    { title: t('nav.contact'), path: '/contact' },
  ];

  // Admin items only visible when authenticated
  const adminItems = [
    { title: 'Blog Admin', path: '/admin/blog' },
    { title: 'Content Manager', path: '/admin/content' },
    { title: 'Testimonial Manager', path: '/admin/testimonials' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getNavbarBackground = () => {
    return scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6';
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarBackground()}`}>
      <div className="container mx-auto px-4 md:px-8">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/a8d9fdf8-e441-4048-ba30-f92269be3e04.png"
              alt="Automatízalo Logo" 
              className="h-10 md:h-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`
                  text-sm font-medium transition-colors py-1.5 px-1 link-underline
                  ${isActive(item.path) 
                    ? 'text-gray-900' 
                    : 'text-slate-700 hover:text-gray-900'
                  }
                `}
              >
                {item.title}
              </Link>
            ))}
            
            {isAuthenticated && adminItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`
                  text-sm font-medium transition-colors py-1.5 px-1 link-underline
                  ${isActive(item.path) 
                    ? 'text-gray-900' 
                    : 'text-slate-700 hover:text-gray-900'
                  }
                `}
              >
                {item.title}
              </Link>
            ))}
            
            <LanguageSwitcher />
            
            {isAuthenticated ? (
              <Button 
                variant="outline" 
                className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={logout}
              >
                {t('nav.logout')}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" className="flex items-center gap-1">
                    <LogIn className="h-4 w-4" />
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button className="bg-gray-900 hover:bg-gray-800 transition-all duration-300 rounded-xl">
                    {t('nav.getStarted')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              className="text-slate-700 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-5 pb-4 absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg animate-fade-in">
            <div className="flex flex-col space-y-4 px-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    py-2 text-base font-medium transition-colors
                    ${isActive(item.path) 
                      ? 'text-gray-900' 
                      : 'text-slate-700 hover:text-gray-900'
                    }
                  `}
                >
                  {item.title}
                </Link>
              ))}
              
              {isAuthenticated && adminItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    py-2 text-base font-medium transition-colors
                    ${isActive(item.path) 
                      ? 'text-gray-900' 
                      : 'text-slate-700 hover:text-gray-900'
                    }
                  `}
                >
                  {item.title}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <Button 
                  variant="outline" 
                  className="w-full mt-2 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={logout}
                >
                  {t('nav.logout')}
                </Button>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-1">
                      <LogIn className="h-4 w-4" />
                      {t('nav.login')}
                    </Button>
                  </Link>
                  <Link to="/contact" className="w-full">
                    <Button className="bg-gray-900 hover:bg-gray-800 w-full transition-all duration-300 rounded-xl">
                      {t('nav.getStarted')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
