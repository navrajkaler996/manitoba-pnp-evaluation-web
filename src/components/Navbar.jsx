import React from "react";
import { Link } from "react-router-dom"; // Use if using react-router

const Navbar = () => {
  return (
    <nav className="bg-tint-white border border-gray-300 px-6 py-4 flex justify-between items-center font-nunito-regular">
      {/* Left: Title */}
      <div className="text-2xl font-bold text-black">MPNP Evaluation</div>

      {/* Right: Navigation Links */}
      <div className="flex space-x-6 text-black font-medium">
        <Link
          to="/eoi-draws"
          className="hover:text-indigo-600 transition-colors">
          EOI draws
        </Link>
        <Link
          to="/ee-draws"
          className="hover:text-indigo-600 transition-colors">
          EE draws
        </Link>
        <Link
          to="/mpnp-data"
          className="hover:text-indigo-600 transition-colors">
          MPNP data
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
