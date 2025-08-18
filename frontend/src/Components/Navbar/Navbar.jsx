import React, { useState } from 'react';
import { Users, Menu, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl shadow-lg group-hover:scale-105 transition-all duration-300">
                <Users className="text-white" size={24} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-slate-800 tracking-tight">
                  LetsConnect
                </span>
                <Sparkles className="text-amber-500" size={16} />
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
<div className="hidden md:flex items-center gap-6">
  {/* Login Button */}
  <Link to='/login'>
  <button className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300 transform hover:-translate-y-0.5">
      Login
    </button>
  </Link>
  
  {/* Signup Button */}
  {/* <Link to="/signup">
    <button className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300 transform hover:-translate-y-0.5">
      Sign Up
    </button>
  </Link> */}
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
            ? 'max-h-40 opacity-100 pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="flex flex-col space-y-3 pt-4 border-t border-slate-200">
            <button className="text-slate-600 hover:text-slate-800 font-medium px-4 py-3 rounded-lg hover:bg-slate-100 transition-all duration-200 text-left">
              Login
            </button>
            <Link to='/signup'>
            <button className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold px-4 py-3 rounded-lg shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300">
              Sign Up
            </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
