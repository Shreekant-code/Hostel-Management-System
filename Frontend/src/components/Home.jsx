import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ShieldCheck, User, Building2 } from "lucide-react";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen w-full flex flex-col lg:flex-row items-center justify-between overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6 lg:px-16 py-12">
      
    
      <h2 className="absolute top-5 left-6 flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold tracking-widest z-10">
        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-900/40">
          <Building2 className="w-5 h-5 text-white" />
        </span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-blue-400">
          HostelEase
        </span>
      </h2>

      
      <div className="flex-1 flex flex-col items-center lg:items-start justify-center text-center lg:text-left z-10 space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-400 to-blue-400">
            Welcome to HostelEase
          </span>
          <span className="block text-gray-200 mt-2">
            Smart. Secure. Seamless.
          </span>
        </h1>

        <p className="mt-2 text-gray-300 text-lg max-w-xl">
          Transform the way hostels operate — from room allotment to student
          management. Experience efficiency powered by technology and design 🚀
        </p>

        <p className="italic text-gray-400 text-base">
          “Your hostel. Your ease. Your digital home.” 💡
        </p>

       
        <div className="flex flex-col sm:flex-row gap-5 mt-8 justify-center lg:justify-start">
          <button
            onClick={() => navigate("/adminSignin")}
            className="group flex items-center justify-center gap-3 px-8 py-3 rounded-2xl 
              bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold shadow-lg 
              shadow-indigo-900 hover:shadow-purple-700 transition-all w-56 sm:w-auto z-10"
          >
            <ShieldCheck className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            Admin Login
          </button>

          <button
            onClick={() => navigate("/studentSignin")}
            className="group flex items-center justify-center gap-3 px-8 py-3 rounded-2xl 
              bg-gradient-to-r from-emerald-500 to-cyan-500 font-semibold shadow-lg 
              shadow-emerald-900 hover:shadow-cyan-700 transition-all w-56 sm:w-auto z-10"
          >
            <User className="w-6 h-6 group-hover:-rotate-12 transition-transform" />
            Student Login
          </button>
        </div>

       
      </div>

     
      <DotLottieReact
  src="https://lottie.host/8db80c52-a9c3-463d-9e9f-353d17c165ce/TiaDwA1OUT.lottie"
  loop
  autoplay
  className="absolute bottom-0 left-0 w-full h-full sm:left-28 pointer-events-none z-0 opacity-30 sm:opacity-100"
  style={{
    objectFit: "cover",
    maxHeight: "100%",
  }}
/>


      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
      </div>

    </section>
  );
};
