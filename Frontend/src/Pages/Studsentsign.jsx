import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/Auth";

export const StudnetSign = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://hostel-management-system-wqq5.onrender.com/student/Login",
        { email, password },
        { withCredentials: true }
      );

      const { accessToken } = res.data;
      setToken(accessToken);
      navigate("/studentdashboard"); // change route if needed
    } catch (error) {
      console.error("Login error:", error);
      const msg =
        error.response?.data?.message || "Invalid credentials or server error.";
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 shadow-2xl rounded-xl flex flex-col md:flex-row overflow-hidden w-full max-w-4xl">
        {/* Left Section */}
        <div className="flex flex-col justify-center items-center bg-indigo-900 p-10 w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-white mb-4 text-center md:text-left">
            Welcome to Hostel Management
          </h2>
          <div className="mt-6">
            <div className="w-48 h-48 bg-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden">
              <img
                src="https://res.cloudinary.com/dtlessn0g/image/upload/v1760998473/hostel_image_l8lacc.png"
                alt="logo_img"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-8 md:p-12 w-full md:w-1/2">
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
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="text-gray-300 mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-all"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
