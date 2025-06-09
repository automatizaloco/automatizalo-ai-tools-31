
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useAdminVerification } from '@/hooks/useAdminVerification';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const { isAdmin, isVerifying } = useAdminVerification();
  
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
    setIsMenuOpen(false);
  }, [location]);

  const navItems = [
    { title: t('nav.home'), path: '/' },
    { title: t('nav.solutions'), path: '/solutions' },
    { title: t('nav.blog'), path: '/blog' },
    { title: t('nav.contact'), path: '/contact' },
    { title: 'Client Portal', path: '/client-portal' },
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
              src="/lovable-uploads/cee7d990-3366-4a2e-9120-691c1267c62c.png"
              alt="Automatízalo Logo" 
              className="h-10 md:h-12"
            />
          </Link>

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
            
            {isAuthenticated && isAdmin && !isVerifying && (
              <Link 
                to="/admin"
                className={`
                  flex items-center gap-2 text-sm font-medium transition-colors py-1.5 px-3 rounded-md
                  ${isActive('/admin') 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-slate-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Settings size={16} />
                Admin Panel
              </Link>
            )}
            
            <div className="z-20">
              <LanguageSwitcher />
            </div>
            
            {isAuthenticated && (
              <Button 
                variant="outline" 
                className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 z-10"
                onClick={logout}
              >
                {t('nav.logout')}
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <div className="z-20">
              <LanguageSwitcher />
            </div>
            <button
              className="text-slate-700 p-2 z-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
              type="button"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden pt-5 pb-4 absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg animate-fade-in z-40 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col space-y-3 px-6">
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
              
              {isAuthenticated && isAdmin && !isVerifying && (
                <Link
                  to="/admin"
                  className={`
                    py-2 text-base font-medium transition-colors flex items-center gap-2
                    ${isActive('/admin') 
                      ? 'text-gray-900' 
                      : 'text-slate-700 hover:text-gray-900'
                    }
                  `}
                >
                  <Settings size={16} />
                  Admin Panel
                </Link>
              )}
              
              {isAuthenticated && (
                <Button 
                  variant="outline" 
                  className="w-full mt-2 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={logout}
                >
                  {t('nav.logout')}
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
