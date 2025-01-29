import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Music, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletButton } from './WalletButton';

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/explore', label: 'Explore' },
    { to: '/verify', label: 'Verify Music' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50">
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Music className="h-8 w-8 text-purple-600" />
              </motion.div>
              <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                Music Explorer
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative text-gray-600 hover:text-purple-600 transition-colors group"
                >
                  {link.label}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
              <WalletButton />
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 md:hidden"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block py-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2">
                  <WalletButton />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <div className="pt-16 md:pt-20">
        <Outlet />
      </div>
    </div>
  );
}