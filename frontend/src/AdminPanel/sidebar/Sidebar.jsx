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
} from "lucide-react";

const Sidebar = ({ children }) => {
  const [active, setActive] = useState("Dashboard");

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

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-white/95 backdrop-blur-xl border-r border-indigo-200/50 flex flex-col shadow-xl">
        {/* Logo */}
        <div className="p-6 border-b border-indigo-100/50 bg-gradient-to-r from-indigo-50 to-cyan-50">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="text-white" size={22} />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 tracking-wide">
                LetsConnect
              </span>
              <Sparkles className="text-amber-500 animate-pulse" size={18} />
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="p-4 border-b border-indigo-100/50 bg-gradient-to-r from-blue-50/50 to-cyan-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-full flex items-center justify-center text-xl shadow-lg">
              👤
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-slate-800">Sumeet Singh</p>
              <span className="text-xs text-slate-600">sumeet@example.com</span>
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
                onClick={() => setActive(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active === item.name
                    ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg hover:shadow-xl"
                    : "text-slate-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-cyan-50 hover:text-indigo-700"
                }`}
              >
                <div className={`${active === item.name ? "text-white" : "text-slate-600"}`}>
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
            to="/logout"
            className="flex items-center gap-3 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl px-4 py-3 w-full font-medium transition-all duration-200"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="p-6">
          {children}
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
