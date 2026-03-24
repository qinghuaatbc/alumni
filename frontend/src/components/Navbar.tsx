import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) =>
    location.pathname === path ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-700 hover:text-white';

  return (
    <nav className="bg-indigo-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-indigo-400 rounded-lg p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-white font-bold text-xl">Alumni Directory</span>
            </Link>
          </div>

          {/* Desktop nav */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')}`}>同学录</Link>
              <Link to="/library" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/library')}`}>阅览室</Link>
              <Link to="/album" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/album')}`}>相册</Link>
              <Link to="/map" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/map')}`}>地图</Link>
              <Link to="/tv" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/tv')}`}>电视厅</Link>
              <Link to="/messages" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/messages')}`}>私信</Link>
              <Link to="/profile" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/profile')}`}>我的</Link>
            </div>
          )}

          {/* User section */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <span className="text-indigo-200 text-sm">
                  Welcome, <span className="text-white font-medium">{user?.username}</span>
                </span>
                {user?.role === 'admin' && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">ADMIN</span>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-indigo-200 hover:text-white text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-indigo-200 hover:text-white p-2 rounded-md"
            >
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
            {isAuthenticated && (
              <>
                <Link to="/" onClick={() => setMenuOpen(false)} className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}>同学录</Link>
                <Link to="/library" onClick={() => setMenuOpen(false)} className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive('/library')}`}>阅览室</Link>
                <Link to="/album" onClick={() => setMenuOpen(false)} className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive('/album')}`}>相册</Link>
                <Link to="/map" onClick={() => setMenuOpen(false)} className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive('/map')}`}>地图</Link>
                <Link to="/tv" onClick={() => setMenuOpen(false)} className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive('/tv')}`}>电视厅</Link>
                <Link to="/messages" onClick={() => setMenuOpen(false)} className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive('/messages')}`}>私信</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className={`block px-3 py-2 rounded-md text-sm font-medium ${isActive('/profile')}`}>我的</Link>
              </>
            )}
            <div className="border-t border-indigo-700 pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <p className="px-3 py-2 text-indigo-300 text-sm">Logged in as <span className="text-white">{user?.username}</span></p>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-300 hover:text-red-200">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-indigo-200 hover:text-white">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-indigo-200 hover:text-white">Register</Link>
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
