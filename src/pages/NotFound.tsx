
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Check if the user was trying to access an admin page or blog page
  const isAdminPath = location.pathname.startsWith('/admin');
  const isBlogPath = location.pathname.startsWith('/blog/');
  
  // For blog paths, extract the slug for a more helpful message
  const blogSlug = isBlogPath ? location.pathname.replace('/blog/', '') : '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página no encontrada</p>
        
        {isBlogPath && (
          <div className="mb-6">
            <p className="text-gray-500 mb-2">
              No pudimos encontrar el artículo <strong>"{blogSlug}"</strong>.
            </p>
            <p className="text-gray-500">
              El artículo puede haber sido movido o eliminado.
            </p>
          </div>
        )}
        
        {!isBlogPath && (
          <p className="text-gray-500 mb-8">
            La página que buscas no existe o ha sido movida.
          </p>
        )}
        
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
          <Link to="/" className="text-white bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md transition-colors flex items-center justify-center">
            <Home className="mr-2 h-4 w-4" />
            Ir al Inicio
          </Link>
          
          {isAdminPath && (
            <Link to="/admin" className="text-blue-500 border border-blue-500 hover:bg-blue-50 px-6 py-2 rounded-md transition-colors">
              Ir al Panel de Administración
            </Link>
          )}
          
          {isBlogPath && (
            <Link to="/blog" className="text-blue-500 border border-blue-500 hover:bg-blue-50 px-6 py-2 rounded-md transition-colors flex items-center justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ver todos los artículos
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
