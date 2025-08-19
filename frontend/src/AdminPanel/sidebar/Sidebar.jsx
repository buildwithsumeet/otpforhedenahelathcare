import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Users,
  UserCog,
  CalendarPlus,
  TreeDeciduous,
  CalendarDays,
  History,
  Bell,
  LogOut,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

const Sidebar = ({ children }) => {
  const [active, setActive] = useState("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "User Management", icon: <Users size={20} />, path: "/users" },
    { name: "Roles Management", icon: <UserCog size={20} />, path: "/roles" },
    { name: "Add Event & Important day", icon: <CalendarPlus size={20} />, path: "/events" },
    { name: "Family Tree", icon: <TreeDeciduous size={20} />, path: "/family-tree" },
    { name: "Add Holiday", icon: <CalendarDays size={20} />, path: "/holidays" },
    { name: "Session History", icon: <History size={20} />, path: "/sessions" },
    { name: "Notifications", icon: <Bell size={20} />, path: "/notifications" },
  ];

  const handleMenuItemClick = (itemName) => {
    setActive(itemName);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/95 backdrop-blur-xl border border-indigo-200/50 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 w-64 h-screen bg-white/95 backdrop-blur-xl border-r border-indigo-200/50 flex flex-col shadow-xl z-40 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Logo */}
        <div className="p-6 border-b border-indigo-100/50 bg-gradient-to-r from-indigo-50 to-cyan-50">
          <div className="flex items-center justify-center gap-2">
            <img
              src="/logo.png"
              alt="LetsConnect logo"
              className="h-8 w-auto block"
              style={{ maxHeight: "2rem" }}
            />
            <Sparkles className="text-amber-500 animate-pulse" size={18} />
          </div>
        </div>

        {/* Profile */}
        <div className="p-4 border-b border-indigo-100/50 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-full flex items-center justify-center text-xl shadow-lg">
              👤
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-slate-800 truncate">Sumeet Singh</p>
              <span className="text-xs text-slate-600 truncate block">sumeet@example.com</span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto scrollbar-hide">
          <div className="space-y-1">
            {menuItems.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                onClick={() => handleMenuItemClick(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active === item.name
                    ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg hover:shadow-xl"
                    : "text-slate-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-cyan-50 hover:text-indigo-700"
                }`}
              >
                <div className={`flex-shrink-0 ${active === item.name ? "text-white" : "text-slate-600"}`}>
                  {item.icon}
                </div>
                <span className="truncate">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-indigo-100/50 bg-slate-50/50">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl px-4 py-3 w-full font-medium transition-all duration-200"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span>Logout</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-screen">
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
