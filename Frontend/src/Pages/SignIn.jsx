import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/Auth.jsx";
import { toast } from "sonner";

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setToken, axiosInstance } = useContext(AuthContext); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/admin/Login", { email, password });
      const { accessToken } = res.data;
      setToken(accessToken);
      toast.success("Admin login successful! 🚀");
      navigate("/admindashboard");
    } catch (error) {
      console.error("Login error:", error);
      const msg = error.response?.data?.message || "Invalid credentials or server error.";
      toast.error(msg);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="bg-gray-800 shadow-2xl rounded-xl flex flex-col md:flex-row overflow-hidden w-full max-w-4xl transition-all hover:scale-105 hover:shadow-indigo-500/50 duration-300">
       
        {/* Left side - welcome image */}
        <div className="flex flex-col justify-center items-center bg-indigo-900 p-10 w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-white mb-4 text-center md:text-left">
            Welcome to Hostel Management
          </h2>
          <div className="mt-6">
            <div className="w-48 h-48 bg-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-lg">
              <img
                src="https://res.cloudinary.com/dtlessn0g/image/upload/v1760998473/hostel_image_l8lacc.png"
                alt="logo_img"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right side - login form */}
        <div className="p-8 md:p-12 w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-6 text-center md:text-left">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-gray-300 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600 placeholder-gray-400 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="text-gray-300 mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600 placeholder-gray-400 transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 bg-gray-700/60 border border-indigo-500 rounded-lg p-4 text-gray-200 text-sm shadow-md hover:shadow-indigo-600 transition-all duration-300 hover:scale-[1.02]">
            <p className="font-semibold text-indigo-400">💡 Demo Admin Login</p>
            <p>
              <span className="text-gray-400">Email:</span> admin1@example.com
            </p>
            <p>
              <span className="text-gray-400">Password:</span> Admin@123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
