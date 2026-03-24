import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, lang, toggleTheme, toggleLang, t } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? 'bg-indigo-800 text-white'
      : 'text-indigo-100 hover:bg-indigo-700 hover:text-white';

  const navLinks = [
    { to: '/', label: t('nav_home') },
    { to: '/library', label: t('nav_library') },
    { to: '/album', label: t('nav_album') },
    { to: '/map', label: t('nav_map') },
    { to: '/tv', label: t('nav_tv') },
    { to: '/messages', label: t('nav_messages') },
    { to: '/profile', label: t('nav_profile') },
  ];

  return (
    <nav className="bg-indigo-900 dark:bg-gray-950 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center min-w-0">
            <Link to="/" className="flex items-center space-x-2 min-w-0">
              <div className="bg-indigo-400 rounded-lg p-2 flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-white font-bold text-base sm:text-lg truncate">华北电力大学无线871</span>
            </Link>
          </div>

          {/* Desktop nav */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center space-x-0.5">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.to)}`}>
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right section */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Theme toggle */}
            <button onClick={toggleTheme}
              className="text-indigo-200 hover:text-white p-2 rounded-lg hover:bg-indigo-800 dark:hover:bg-gray-800 transition-colors"
              title={theme === 'dark' ? '切换白天' : '切换夜间'}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {/* Lang toggle */}
            <button onClick={toggleLang}
              className="text-indigo-200 hover:text-white px-2 py-1.5 rounded-lg hover:bg-indigo-800 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
              {lang === 'zh' ? 'EN' : '中'}
            </button>

            {isAuthenticated ? (
              <>
                <span className="text-indigo-200 text-sm">
                  {t('nav_welcome')}<span className="text-white font-medium">{user?.username}</span>
                </span>
                {user?.role === 'admin' && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">ADMIN</span>
                )}
                <button onClick={handleLogout}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                  {t('nav_logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-indigo-200 hover:text-white text-sm font-medium transition-colors">
                  {t('nav_login')}
                </Link>
                <Link to="/register" className="bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                  {t('nav_register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile: theme+lang+menu */}
          <div className="md:hidden flex items-center gap-1">
            <button onClick={toggleTheme}
              className="text-indigo-200 hover:text-white p-2 rounded-lg transition-colors text-base">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button onClick={toggleLang}
              className="text-indigo-200 hover:text-white px-2 py-1.5 rounded-lg transition-colors text-sm font-medium">
              {lang === 'zh' ? 'EN' : '中'}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="text-indigo-200 hover:text-white p-2 rounded-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-3 space-y-1">
            {isAuthenticated && navLinks.map(link => (
              <Link key={link.to} to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-sm font-medium ${isActive(link.to)}`}>
                {link.label}
              </Link>
            ))}
            <div className="border-t border-indigo-700 dark:border-gray-700 pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <p className="px-3 py-2 text-indigo-300 text-sm">
                    {t('nav_welcome')}<span className="text-white">{user?.username}</span>
                    {user?.role === 'admin' && <span className="ml-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full">ADMIN</span>}
                  </p>
                  <button onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-300 hover:text-red-200">
                    {t('nav_logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-indigo-200 hover:text-white">{t('nav_login')}</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-indigo-200 hover:text-white">{t('nav_register')}</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
