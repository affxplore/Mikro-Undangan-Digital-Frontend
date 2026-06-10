import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../api/auth/useAuth"; // <-- 1. Import useAuth
import { FaSearch, FaDollarSign, FaHome, FaUserCog } from "react-icons/fa";
import { GrTemplate } from "react-icons/gr";
import { MdManageHistory } from "react-icons/md";
import { HiOutlineViewList } from "react-icons/hi";
import { SlEnvolopeLetter } from "react-icons/sl";
import { BiArchiveIn } from "react-icons/bi";
import { GiNothingToSay } from "react-icons/gi";
import {IoSettingsOutline} from "react-icons/io5";
import useSystemContent from "../api/system_content/useSystemContent";

import { TbReport } from "react-icons/tb";
import { PiShareNetworkLight } from "react-icons/pi";
// import Logo from "../assets/logo/mikroUD-logo.png";

const sidebarItems = [
  // Dashboard User
  { name: "Dashboard", icon: <FaHome />, path: "dashboard", roles: ['User'] },
  { name: "Invitations", icon: <SlEnvolopeLetter />, path: "invitations" , roles: ['User']},
  { name: "List Template", icon: <FaSearch />, path: "templates", roles: ['User'] },
  { name: "Receiver", icon: <BiArchiveIn />, path: "receiver", roles: ['User'] },
  // { name: "Kirim Undangan", icon: <PiShareNetworkLight/>, path:"share", roles: ['User']},
  { name: "Ucapan dan Doa", icon: <GiNothingToSay />, path: "ucapan" , roles: ['User']},
  { name: "Affiliate ", icon: <FaDollarSign />, path: "affiliate", badge: "new", roles: ['User'] },
  // { name: "Example", icon: <HiOutlineViewList />, path: " example" , roles: ['User']},
  
  // { name: "Invitations", icon: <HiOutlineViewList />, path: "/invitations" },
  
  // { name: "Example", icon: <HiOutlineViewList />, path: "/example" }


  // Dashboard Admin
  { name: "Dashboard (Admin)", icon: <FaHome />, path: "dashboardadmin" , roles: ['Super Admin', 'Owner'] },
  { name: "Manage Invitation (Admin)", icon: <SlEnvolopeLetter />, path: "manageinvit" , roles: ['Super Admin', 'Owner']},
  { name: "Manage User (Admin)", icon: <FaUserCog />, path: "manageuser" , roles: ['Super Admin', 'Owner']},
  { name: "Manage Template (Admin)", icon: <GrTemplate />, path: "managetemplate" , roles: ['Super Admin', 'Owner']},
  { name: "Manage Affiliate (Admin)", icon: <FaDollarSign />, path: "manageaffiliate" , roles: ['Super Admin', 'Owner']},
  { name: "Management (Admin)", icon: <MdManageHistory />, path: "datamaster" , roles: ['Super Admin', 'Owner']},
  { name: "Website Report (Admin)", icon: <TbReport />, path: "webreport" , roles: ['Super Admin', 'Owner']},
  { name: "System Setting (Admin)", icon: <IoSettingsOutline />, path: "systemsetting" , roles: ['Super Admin', 'Owner']},

];

export default function Sidebar({ isVisible }) {
  const { user } = useAuth(); // <-- 3. Ambil data user dari konteks
  const { getByKey } = useSystemContent();

   const [logoUrl, setLogoUrl] = useState(""); // Sediakan logo default


   useEffect(() => {
    const fetchLogo = async () => {
      console.log("[SIDEBAR-LOG] Memulai fetchLogo...");
      const logoContent = await getByKey('logo_app');
      
      // --- TAMBAHKAN CONSOLE LOG DI SINI ---
      console.log("[SIDEBAR-LOG] Data 'logoContent' yang diterima dari hook:", logoContent);

      if (logoContent && logoContent.content) {
        const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:2222";
        const finalUrl = `${SERVER_URL}${logoContent.content}`;
        
        console.log("[SIDEBAR-LOG] URL final untuk logo:", finalUrl);
        setLogoUrl(finalUrl);
      } else {
        console.log("[SIDEBAR-LOG] logoContent tidak ditemukan atau tidak memiliki 'content'. Menggunakan logo default.");
      }
    };
    fetchLogo();
  }, [getByKey]);

  // 4. Filter menu berdasarkan role pengguna
   const userRole = user?.role?.name; // Ambil nama role, cth: "Admin", "User"
  const accessibleItems = sidebarItems.filter(item => 
    item.roles.includes(userRole)
  );

  const appName = import.meta.env.VITE_APP_NAME || "Mikro Undangan"; 
  return (
    <div
      className={`fixed inset-y-0 left-0 overflow-y-auto ${
        isVisible ? "w-64" : "w-16"
      } bg-white border-r flex flex-col transition-all duration-300`}
    >
      <div className="flex items-center px-4 py-4">
              <img
          src={logoUrl} // Gunakan state dinamis
          alt="Logo"
          className={`h-10 w-10 mr-2 ${!isVisible && "mx-auto"}`}
        />

        {isVisible && (
          <span className="font-bold text-lg text-black">{appName}</span>      )}
      </div>
      <nav className="flex-1 px-2 py-2 space-y-1 text-sm">
        <div
          className={`text-gray-400 uppercase mt-4 mb-2 ${
            !isVisible && "hidden"
          }`}
        >
          Content
        </div>
        {accessibleItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `font-bold flex items-center px-4 py-4 rounded hover:bg-gray-100 ${
                isActive ? "bg-gray-200 text-blue-600" : "text-gray-700"
              }`
            }
            aria-label={item.name}
          >
            <span className="mr-4 text-lg">{item.icon}</span>
            {isVisible && item.name}
            {isVisible && item.badge && (
              <span className="ml-auto font-bold text-xs bg-yellow-400 text-white px-2 rounded">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
