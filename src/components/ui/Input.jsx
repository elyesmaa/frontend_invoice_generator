import React from "react";

const Input = ({ label, id, type = "text", placeholder = "", error, icon: Icon, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
            error ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-black"
          }`}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
