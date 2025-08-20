import React from "react";
import Sidebar from "./sidebar/Sidebar";
import { Outlet, Navigate } from "react-router-dom";

const AdminLayout = () => {
  // Get user from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  console.log("AdminLayout user:", user.role);

  // 1. Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 2. Not admin
  if (user.role !== "admin" && user.role !== "superadmin" && user.role !== "user") {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">🚫 Access Denied</h2>
        <p className="text-gray-600 mb-4">
          This page is for <strong>Admins only</strong>.
        </p>
        <a
          href="/"
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
        >
          Go Home
        </a>
      </div>
    );
  }

  // 3. Admin
  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
};

export default AdminLayout;
