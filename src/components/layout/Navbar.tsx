
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
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
    { title: 'Blog Admin', path: '/admin/blog' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 md:px-8">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/d2b2a72c-6cfe-4670-8019-000ed70ff370.png" 
              alt="Automatízalo Logo" 
              className="h-8 md:h-10"
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
                    ? 'text-automatizalo-blue' 
                    : 'text-slate-700 hover:text-automatizalo-blue'
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
                    ? 'text-automatizalo-blue' 
                    : 'text-slate-700 hover:text-automatizalo-blue'
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
                Logout
              </Button>
            ) : (
              <Button className="bg-automatizalo-blue hover:bg-automatizalo-blue/90 transition-all duration-300 rounded-xl">
                {t('nav.getStarted')}
              </Button>
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
                      ? 'text-automatizalo-blue' 
                      : 'text-slate-700 hover:text-automatizalo-blue'
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
                      ? 'text-automatizalo-blue' 
                      : 'text-slate-700 hover:text-automatizalo-blue'
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
                  Logout
                </Button>
              ) : (
                <Button className="bg-automatizalo-blue hover:bg-automatizalo-blue/90 w-full mt-2 transition-all duration-300 rounded-xl">
                  {t('nav.getStarted')}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
