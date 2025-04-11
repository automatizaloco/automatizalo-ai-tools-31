
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Check if the user was trying to access an admin page
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
          <Link to="/" className="text-white bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md transition-colors">
            Return to Home
          </Link>
          {isAdminPath && (
            <Link to="/admin" className="text-blue-500 border border-blue-500 hover:bg-blue-50 px-6 py-2 rounded-md transition-colors">
              Go to Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
