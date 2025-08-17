import React from "react";

const StatusCard = ({ title, count, icon: Icon, color }) => {
  return (
    <div
      className={`p-6 rounded-2xl shadow-md border ${color.border} ${color.bg} hover:${color.hover} transition duration-200`}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={`p-3 rounded-full ${color.iconBg} ${color.iconText} flex items-center justify-center`}
        >
          <Icon size={26} />
        </div>

        {/* Content */}
        <div>
          <p className={`text-sm font-medium ${color.text}`}>{title}</p>
          <h2 className="text-2xl font-bold text-gray-900">{count}</h2>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
