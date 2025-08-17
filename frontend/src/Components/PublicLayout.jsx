import React from "react";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-screen">
      {/* Optional: navbar/header here */}
      <Outlet />  {/* <-- This is where Home/About/etc will render */}
    </div>
  );
};

export default PublicLayout;
