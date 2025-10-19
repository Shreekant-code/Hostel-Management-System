import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { User, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
//   const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 md:px-0">

           <div className="absolute inset-0 w-full h-full opacity-25 z-0 pointer-events-none">
        <DotLottieReact
          src="https://assets10.lottiefiles.com/packages/lf20_fJj2D2.json"
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>

  
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="absolute top-10 left-10 w-24 h-24 opacity-20 text-gray-700 animate-bounce-slow">
          <rect width="24" height="24" fill="currentColor" rx="4" />
        </svg>
        <svg className="absolute top-1/2 right-20 w-20 h-20 opacity-20 text-gray-600 animate-bounce-slower">
          <circle cx="10" cy="10" r="10" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-40 left-1/4 w-28 h-28 opacity-15 text-gray-500 animate-bounce-slow">
          <polygon points="0,28 14,0 28,28" fill="currentColor" />
        </svg>
      
      </div>

      {/* Header */}
      <header className="z-10 text-center mb-12">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-400 to-blue-400"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Hostel Management Portal
        </motion.h1>
        <motion.p
          className="text-gray-300 mt-3 text-sm sm:text-base md:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Seamless student & room management made smart ✨
        </motion.p>
      </header>

   
      <motion.div
        className="z-10 flex flex-col sm:flex-row gap-6 mt-6 justify-center items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        
        <motion.button
        //   onClick={() => navigate("/admin-login")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold shadow-lg shadow-indigo-900 hover:shadow-purple-700 transition-all w-56 sm:w-auto justify-center"
        >
          <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform" />
          Admin Login
        </motion.button>

        
        <motion.button
        //   onClick={() => navigate("/student-login")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-semibold shadow-lg shadow-emerald-900 hover:shadow-cyan-700 transition-all w-56 sm:w-auto justify-center"
        >
          <User className="w-6 h-6 sm:w-7 sm:h-7 group-hover:-rotate-12 transition-transform" />
          Student Login
        </motion.button>
      </motion.div>

      
    </div>
  );
};
