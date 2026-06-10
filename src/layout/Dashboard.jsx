import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);

return (
    <>
        <div className="flex">
            <Sidebar isVisible={isSidebarVisible} />
            <div
              className={`flex flex-col flex-1 ${
                isSidebarVisible ? "ml-64" : "ml-16"
              } min-h-screen bg-gray-50`}
            >
                <Topbar toggleSidebar={toggleSidebar} isSidebarVisible={isSidebarVisible} />
                
                <main className="p-4">
                    <Outlet />
                </main>
                <a
                    href="#"
                    className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-3 shadow-lg"
                    title="Mau Dibuatkan? Ada Kendala?"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.01 2.003a10 10 0 00-8.454 15.365L2 22l4.72-1.547a9.996 9.996 0 005.29 1.49h.002a10 10 0 000-20zm5.6 14.402c-.235.662-1.375 1.25-1.906 1.328-.492.072-1.112.103-1.793-.113a14.448 14.448 0 01-3.1-1.384 11.956 11.956 0 01-2.645-2.158 8.372 8.372 0 01-1.772-2.99c-.195-.573-.206-1.068-.027-1.48.23-.548.803-.898 1.085-1.013.28-.114.607-.17.961-.17.144 0 .272.006.39.012.124.006.29-.047.456.35.175.41.595 1.41.647 1.514.053.103.088.22.017.354-.07.134-.105.216-.206.335-.104.123-.22.274-.313.368-.104.104-.213.218-.093.428.12.21.535.88 1.15 1.425a12.547 12.547 0 001.92 1.2c.476.206.759.276 1.03.184.272-.092.672-.274.872-.54.226-.295.49-.615.743-.942.093-.12.206-.134.335-.093.129.042.81.383.948.452.138.069.23.104.265.162.035.058.035.332-.2.993z" />
                    </svg>
                </a>
            </div>
        </div>
    </>
);
};

export default DashboardLayout;