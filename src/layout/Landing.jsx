// import React from "react";
// import LandingNav from "../components/LandingNavbar";
// import LandingFoot from "../components/LandingFoot";
// import { Outlet } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// const LayoutLand = () => {
//     var nav = useNavigate();
//     return ( 
//     <>
//         <div className="font-sans text-gray-800">
//             {/* Navbar */}
//             <LandingNav />  

//             <Outlet />

//             {/* Footer */}
//             { window.location.pathname !== "/" ? <LandingFoot /> : null}
//         </div>
//     </>      
//      );
// }
 
// export default LayoutLand;
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import LandingFoot from "../components/LandingFoot";
import LandingNav from "../components/LandingNavbar";

const LayoutLand = () => {
    const location = useLocation(); // 2. Dapatkan objek lokasi saat ini

    const isRoutelanding = location.pathname !== "/"; // Cek apakah rute saat ini adalah "/"
    return ( 
    <>
        <div className="font-sans text-gray-800">

            {isRoutelanding &&  <LandingNav />}
            <Outlet />

            {/* Footer */}
            {/* 3. Gunakan location.pathname */}
            { location.pathname !== "/" ? <LandingFoot /> : null }
        </div>
    </>        
    );
}
 
export default LayoutLand;