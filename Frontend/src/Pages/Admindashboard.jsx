import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  BedDouble,
  Users,
  UserPlus,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

export const Admindashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
  
      <nav className="fixed top-0 z-50 w-full bg-gray-900 border-b border-gray-700">
        <div className="px-4 py-3 lg:px-5 bg-black flex items-center justify-between">
        
          <div className="flex items-center">
       
            <button
              type="button"
              onClick={toggleSidebar}
              className="inline-flex items-center p-2 text-gray-400 rounded-lg sm:hidden hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>

          
            <a href="#" className="flex items-center ml-3">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8 mr-2"
                alt="Logo"
              />
              <span className="text-xl font-semibold text-white">
                Hostel Admin
              </span>
            </a>
          </div>

        
          <div className="flex items-center space-x-3">
            <img
              className="w-10 h-10 rounded-full border-2 border-gray-600"
              src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              alt="user"
            />
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-gray-900 border-r border-gray-700 transform transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium text-gray-300">
            <li>
              <Link
                to="/admindashboard"
                className="flex items-center p-2 rounded-lg hover:bg-gray-800 transition"
                onClick={() => setIsSidebarOpen(false)}
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admindashboard/rooms"
                className="flex items-center p-2 rounded-lg hover:bg-gray-800 transition"
                onClick={() => setIsSidebarOpen(false)}
              >
                <BedDouble className="w-5 h-5 mr-3" />
                <span>Rooms</span>
              </Link>
            </li>

            

            <li>
              <Link
                to="/admindashboard/add-student"
                className="flex items-center p-2 rounded-lg hover:bg-gray-800 transition"
                onClick={() => setIsSidebarOpen(false)}
              >
                <UserPlus className="w-5 h-5 mr-3" />
                <span>Add Student</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admindashboard/students"
                className="flex items-center p-2 rounded-lg hover:bg-gray-800 transition"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Users className="w-5 h-5 mr-3" />
                <span>Students</span>
              </Link>
            </li>

           

           
          </ul>
        </div>
      </aside>

    
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
        ></div>
      )}

      
      <main className="p-4 sm:ml-64 mt-16 bg-black min-h-screen text-white transition-all duration-300">
        <div className="rounded-lg p-6">
          <Outlet />
        </div>
      </main>
    </>
  );
};
