import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Accessibility, Map, FileText, LayoutDashboard, BarChart3, Menu, X, LogOut, UserCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const links = [
    { name: 'Map', path: '/map', icon: <Map className="w-4 h-4 mr-2" /> },
    { name: 'Report', path: '/report', icon: <FileText className="w-4 h-4 mr-2" /> },
    ...(user?.role === 'admin' ? [{ name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> }] : []),
    ...(user ? [{ name: 'My Profile', path: '/profile', icon: <UserCircle className="w-4 h-4 mr-2" /> }] : []),
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100/50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-primary font-bold text-xl tracking-tight">
              <Accessibility className="h-6 w-6 mr-2" />
              Para Vision
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  isActive(link.path) 
                    ? 'text-primary' 
                    : 'text-muted hover:text-primary hover:bg-gray-50/50'
                }`}
              >
                {isActive(link.path) && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-primary/5 rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {link.icon}
                <span className="relative">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Auth section */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                  <UserCircle className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="text-xs bg-primary text-white px-1.5 py-0.5 rounded font-semibold tracking-wide">ADMIN</span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-1.5 px-4">Sign in</Link>
                <Link to="/signup" className="btn-primary text-sm py-1.5 px-4">Sign up</Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-primary focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 sm:px-3">
              {links.map((link, index) => (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  key={link.path}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-base font-bold transition-all ${
                      isActive(link.path)
                        ? 'bg-primary/5 text-primary shadow-sm'
                        : 'text-muted hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${isActive(link.path) ? 'bg-primary/10' : 'bg-gray-100 text-gray-400'}`}>
                      {link.icon}
                    </div>
                    {link.name}
                    {isActive(link.path) && <ChevronRight className="ml-auto w-4 h-4" />}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 border-t border-gray-100 mt-4 space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <UserCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="flex items-center w-full px-4 py-3 rounded-xl text-base font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <div className="p-2 bg-red-100 rounded-lg mr-3">
                        <LogOut className="w-4 h-4" />
                      </div>
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link 
                      to="/login" 
                      onClick={() => setIsOpen(false)} 
                      className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold text-slate-700 bg-gray-100 hover:bg-gray-200 transition-all"
                    >
                      Sign in
                    </Link>
                    <Link 
                      to="/signup" 
                      onClick={() => setIsOpen(false)} 
                      className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold text-white bg-primary shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
