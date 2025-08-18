import React from "react";

const StatusCard = ({ title, count, icon: Icon, color }) => {
  return (
    <div
      className={`p-6 rounded-2xl border ${color.border} ${color.bg} hover:${color.hover} transition-all duration-200 hover:shadow-lg group backdrop-blur-sm`}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={`p-3 rounded-xl ${color.iconBg} ${color.iconText} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200`}
        >
          <Icon size={22} />
        </div>

        {/* Content */}
        <div>
          <p className={`text-sm font-medium ${color.text} mb-1`}>
            {title}
          </p>
          <h2 className="text-2xl font-bold text-slate-800">
            {count.toLocaleString()}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
