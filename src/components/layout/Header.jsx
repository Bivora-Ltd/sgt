import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Heart } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigationLinks = [
    { name: 'Home', path: '/' },
    { name: 'Contestants', path: '/contestants' },
    { name: 'Register', path: '/register' },
    { name: 'Donate', path: '/donate' },
    { name: 'Admin', path: '/admin' }
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-green-400 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="">
              <img src="/logo.png" alt="Logo" className="w-24" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActivePath(link.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/search"
              className="p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-200"
            >
              <Search className="h-5 w-5" />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-primary-50"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-up">
            <div className="flex flex-col space-y-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActivePath(link.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/search"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 flex items-center"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;