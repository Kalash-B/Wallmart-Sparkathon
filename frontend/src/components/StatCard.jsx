import React from "react";

const StatCard = ({ iconClass, bgColor, iconColor, label, value }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${bgColor} ${iconColor}`}>
          <i className={`${iconClass} fa-2x`}></i>
        </div>
        <div className="ml-4">
          <p className="text-gray-500">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;


