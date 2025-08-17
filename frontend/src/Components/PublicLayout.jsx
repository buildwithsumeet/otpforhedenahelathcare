import React from "react";

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      {/* Add header/nav if you want */}
      {children}
    </div>
  );
};

export default PublicLayout;
