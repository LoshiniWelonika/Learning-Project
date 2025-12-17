import React from "react";
import './css/OptionButton.css';

function OptionButton({ label, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-1/3 border rounded-md py-3 mx-1 transition
        ${active ? "bg-teal-100 border-teal-500" : "bg-gray-100 hover:bg-gray-200"}
      `}
    >
      <span className="text-2xl">{icon}</span>
      <span className="mt-1 text-sm font-medium">{label}</span>
    </button>
  );
}

export default OptionButton;
