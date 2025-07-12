import React from "react";

const ChartCard = ({ title, canvasRef }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold text-gray-700 mb-2">{title}</h3>
      <div className="h-64">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default ChartCard;