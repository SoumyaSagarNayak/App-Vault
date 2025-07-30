import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Link as LinkIcon, 
  FileText, 
  Lock, 
  CheckSquare, 
  Calendar as CalendarIcon,
  User, 
  Code, 
  Moon, 
  Sun,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getUserCount } from '../utils/userCounter';

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userCount = getUserCount();

  const navLinks = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/links', icon: LinkIcon, label: 'Links' },
    { path: '/pdfs', icon: FileText, label: 'PDFs' },
    { path: '/passwords', icon: Lock, label: 'Passwords' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/calendar', icon: CalendarIcon, label: 'Calendar' },
    { path: '/creator', icon: Code, label: 'Creator' },
  ];

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                App Vault
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {userCount.toLocaleString()} users
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === path
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Feature Badge */}
            <div className="hidden lg:flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              <span>⭐ Star on GitHub</span>
              <a
                href="https://github.com/SoumyaSagarNayak"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                @SoumyaSagarNayak
              </a>
            </div>
            
            {/* Feedback Button */}
            <a
              href="mailto:soumyasagarnayak351@gmail.com?subject=App Vault Feedback&body=Hi Soumya, I have some feedback about App Vault:"
              className="hidden md:flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 px-3 py-1 rounded-lg transition-colors text-sm"
            >
              <span>💬</span>
              <span>Feedback</span>
            </a>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link
              to="/profile"
              className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold hover:scale-105 transition-transform"
            >
              U
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700">
            {/* Mobile Feature Links */}
            <div className="flex flex-col space-y-2 mb-4 px-3">
              <a
                href="https://github.com/SoumyaSagarNayak"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 rounded-lg text-sm font-medium"
              >
                <span>⭐</span>
                <span>Star on GitHub</span>
              </a>
              <a
                href="mailto:soumyasagarnayak351@gmail.com?subject=App Vault Feedback&body=Hi Soumya, I have some feedback about App Vault:"
                className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-2 rounded-lg text-sm"
              >
                <span>💬</span>
                <span>Send Feedback</span>
              </a>
            </div>
            
            <nav className="flex flex-col space-y-2">
              {navLinks.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === path
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;