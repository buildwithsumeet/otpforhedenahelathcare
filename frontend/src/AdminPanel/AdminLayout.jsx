import React from "react";
import Sidebar from "./sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar fixed on the left */}
      <div className="w-64 min-h-screen bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 ">
        <Outlet />   {/* ⬅️ Child routes (Dashboard, etc.) will render here */}
      </div>
    </div>
  );
};

export default AdminLayout;
