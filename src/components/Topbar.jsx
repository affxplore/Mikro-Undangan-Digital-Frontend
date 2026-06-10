/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../api/auth/useAuth";
import { FaBars, FaUserCircle, FaSignOutAlt, FaCog } from "react-icons/fa";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:2222";

export default function Topbar({ toggleSidebar, isSidebarVisible }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const basePath = location.pathname.startsWith('/dashboardadmin') ? '/dashboardadmin' : '/dashboard';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  return (
    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md">
      <button
        onClick={toggleSidebar}
        className="flex items-center space-x-2 bg-white text-blue-500 px-3 py-2 rounded-lg shadow hover:bg-gray-100 transition"
      >
        <FaBars />
      </button>

      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center space-x-2 focus:outline-none"
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
            <img
            src={user?.avatarUrl ? `${SERVER_URL}${user.avatarUrl}` : `https://ui-avatars.com/api/?name=${user?.full_name}`}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
          <span className="hidden sm:block font-semibold">{user?.username || 'User'}</span>
               <svg
            className={`ml-1 w-4 h-4 transform transition-transform ${
              isDropdownOpen ? "rotate-180" : "rotate-0"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white text-gray-700 rounded-lg shadow-lg z-10">
            <Link
              to="profile"
              className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
            >
              <FaUserCircle className="mr-2" />
              Profile
            </Link>
            <Link
              to="accountset"
              className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
            >
              <FaCog className="mr-2" />
              Account Setting
            </Link>
            <button
              onClick={logout}
              className="w-full text-left flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 transition"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
