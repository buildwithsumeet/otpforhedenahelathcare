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
  Menu,
} from "lucide-react";

const Sidebar = ({ children }) => {
  const [open, setOpen] = useState(true);
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
      <div
        className={`fixed top-0 left-0 transition-all duration-300 ${
          open ? "w-60" : "w-16"
        } h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm`}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span
            className={`text-lg font-bold text-gray-800 tracking-wide ${
              !open && "hidden"
            }`}
          >
            LET'S CONNECT
          </span>
          <button
            onClick={() => setOpen(!open)}
            className="p-1 rounded hover:bg-gray-100"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-yellow-100">
          <div className="w-10 h-10 bg-yellow-200 text-yellow-700 rounded-full flex items-center justify-center text-lg shadow-inner">
            👤
          </div>
          {open && (
            <div>
              <p className="font-semibold text-sm text-gray-900">Sumeet Singh</p>
              <span className="text-xs text-gray-600">sumeet@example.com</span>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              onClick={() => setActive(item.name)}
              className={`w-full flex items-center gap-3 px-6 py-2.5 rounded-md text-base font-medium transition-colors ${
                active === item.name
                  ? "bg-yellow-200 text-yellow-800 font-bold shadow"
                  : "text-gray-700 hover:bg-yellow-50"
              }`}
            >
              {item.icon}
              {open && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/logout"
            className="flex items-center gap-3 text-red-500 hover:text-red-600 rounded-md px-2 py-2 w-full font-medium"
          >
            <LogOut size={20} />
            {open && <span>Logout</span>}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          open ? "ml-60" : "ml-16"
        } p-6`}
      >
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
