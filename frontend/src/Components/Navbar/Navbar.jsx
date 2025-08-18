import React, { useState } from 'react';
import { Users, Menu, X, Sparkles, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate import
import { useUser } from '../../ContextApi/UserContext';
import { logoutApi } from '../../Api/logoutApi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate(); // Add this line
  const isLoggedIn = !!user; 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
  try {
    const res = await logoutApi();

    if (res.success) {
      // ✅ Logout successful
      console.log("Logged out successfully");
      // e.g. clear local state, redirect, etc.
      localStorage.clear();
      window.location.href = "/login";
    } else {
      console.error("Logout failed:", res.message);
    }
  } catch (err) {
    console.error("Error while logging out:", err);
  }
};

  // Rest of your component remains the same...
  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl shadow-lg group-hover:scale-105 transition-all duration-300">
                <Users className="text-white" size={24} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-slate-800 tracking-tight">
                  LetsConnect
                </span>
                <Sparkles className="text-amber-500" size={16} />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              // Logged in state
              <div className="flex items-center gap-4">
                <Link 
                  to="/dashboard"
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <User size={18} />
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              // Not logged in state
              <div className="flex items-center gap-4">
                <Link to="/login">
                  <button className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300 transform hover:-translate-y-0.5">
                    Login
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-48 opacity-100 pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="flex flex-col space-y-3 pt-4 border-t border-slate-200">
            {isLoggedIn ? (
              // Mobile logged in state
              <>
                <Link 
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold px-4 py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 flex items-center gap-2"
                >
                  <User size={18} />
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold px-4 py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              // Mobile not logged in state
              <>
                <Link 
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <button className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold px-4 py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300">
                    Login
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
