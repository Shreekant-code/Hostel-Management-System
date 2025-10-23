import React, { useState, useEffect, useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Menu, Bell, User, Users, Book, Star } from "lucide-react"; 
import { AuthContext } from "../Context/Auth";

export const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);

  const { axiosInstance } = useContext(AuthContext);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axiosInstance.get("/student/mydetails");
        setStudent(res.data.student);
      } catch (err) {
        console.error("Failed to fetch student details", err);
      }
    };

    fetchStudent();
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !student) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <DotLottieReact
           src="https://lottie.host/8d1e9224-bd04-4885-8abd-ea8bafb2662c/JqmVKjsrY9.lottie"
          autoplay
          loop
          style={{ width: 600, height: 600 }}
        />
      </div>
    );
  }

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-gray-900 border-b border-gray-700">
        <div className="px-4 py-3 lg:px-5 flex items-center justify-between bg-black">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="inline-flex items-center p-2 text-gray-400 rounded-lg sm:hidden hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-xl font-semibold text-white">
              Welcome, {student.firstName}!
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button className="relative p-2 text-gray-400 rounded-full hover:bg-gray-800">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {student.image ? (
              <img
                className="w-10 h-10 rounded-full border-2 border-gray-600"
                src={student.image}
                alt={`${student.firstName} ${student.lastName}`}
              />
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-gray-600 bg-indigo-700 flex items-center justify-center text-white font-bold">
                {student.firstName?.charAt(0).toUpperCase()}
                {student.lastName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </nav>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-gray-900 border-r border-gray-700 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 flex flex-col justify-between overflow-y-auto">
          <ul className="space-y-2 font-medium text-gray-300">
            <li>
              <Link
                to="/studentdashboard"
                className="flex items-center p-2 rounded-lg hover:bg-gray-800 transition"
                onClick={() => setIsSidebarOpen(false)}
              >
                <User className="w-5 h-5 mr-3" />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to="/studentdashboard/roommates"
                className="flex items-center p-2 rounded-lg hover:bg-gray-800 transition"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Users className="w-5 h-5 mr-3" />
                <span>Roommates</span>
              </Link>
            </li>
            
            <li>
              <Link
                to="/studentdashboard/upcoming-feature"
                className="flex items-center p-2 rounded-lg hover:bg-gray-800 transition"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Star className="w-5 h-5 mr-3" />
                <span>Upcoming Features</span>
              </Link>
            </li>
          </ul>

          <div className="mt-auto flex justify-center pb-4">
            <DotLottieReact
              src="https://lottie.host/48ae55b5-a4cf-46a9-beef-8620442a4b72/BPwkxsHxNx.lottie"
              loop
              autoplay
              className="w-92 h-128"
            />
          </div>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
        ></div>
      )}

      <main className="p-4 sm:ml-64 mt-16 bg-black min-h-screen text-white transition-all duration-300">
        <div className="rounded-lg px-0 py-2">
          <Outlet />
        </div>
      </main>
    </>
  );
};
