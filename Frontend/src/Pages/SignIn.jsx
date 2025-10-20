import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);

    // For testing: navigate without validation
    navigate("/admindashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 shadow-2xl rounded-xl flex flex-col md:flex-row overflow-hidden w-full max-w-4xl">

        {/* Left Side */}
        <div className="flex flex-col justify-center items-center bg-indigo-900 p-10 w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-white mb-4 text-center md:text-left">
            Welcome to Hostel Management
          </h2>
          <div className="mt-6">
            <div className="w-48 h-48 bg-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
              HMS
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:p-12 w-full md:w-1/2">
          <h2 className="text-2xl font-bold text-white mb-6 text-center md:text-left">Sign In</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email input */}
            <div>
              <label className="text-gray-300 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>

            {/* Password input */}
            <div>
              <label className="text-gray-300 mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
              />
            </div>

            {/* Login Button */}
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
