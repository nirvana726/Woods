// src/components/admin/Navbar.jsx
import React from "react";
import { 
  FaUser, 
  FaBed, 
  FaHiking, 
  FaEnvelope, 
  FaImages, 
  FaCalendarAlt,
  FaSignOutAlt,
  FaCog
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navbarMenu = [
  { id: 1, name: "Dashboard", link: "/admin/details", icon: <FaUser />, description: "Admin profile & overview" },
  { id: 6, name: "Rooms", link: "/admin/rooms", icon: <FaBed />, description: "Manage room inventory" },
  { id: 7, name: "Activities", link: "/admin/activities", icon: <FaHiking />, description: "Manage resort activities" },
  { id: 10, name: "Bookings", link: "/admin/booking", icon: <FaCalendarAlt />, description: "Handle reservations" },
  { id: 8, name: "Messages", link: "/admin/contact", icon: <FaEnvelope />, description: "Contact inquiries" },
  { id: 9, name: "Gallery", link: "/admin/gallery", icon: <FaImages />, description: "Manage media content" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border-r border-gray-200/50 w-80 min-h-screen flex flex-col">
      {/* Logo/Brand Section */}
      <div className="p-8 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <FaCog className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              The Woods Resort
            </h2>
            <p className="text-sm text-gray-500">Administration Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-6 space-y-2">
        {navbarMenu.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className={`group flex items-center p-4 rounded-2xl transition-all duration-300 ${
              pathname === item.link
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                : "hover:bg-gray-50/80 text-gray-700 hover:text-gray-900"
            }`}
          >
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              pathname === item.link
                ? "bg-white/20"
                : "group-hover:bg-gray-100"
            }`}>
              <span className="text-lg">{item.icon}</span>
            </div>
            <div className="ml-4 flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className={`text-xs mt-0.5 ${
                pathname === item.link ? "text-blue-100" : "text-gray-500"
              }`}>
                {item.description}
              </div>
            </div>
          </Link>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-6 border-t border-gray-200/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-4 rounded-2xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
        >
          <div className="p-2 rounded-xl group-hover:bg-red-100 transition-all duration-300">
            <FaSignOutAlt className="text-lg" />
          </div>
          <span className="ml-4 font-semibold">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;