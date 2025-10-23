import { useEffect, useState } from "react";

export const Footer = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

 
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="relative bg-gray-900 text-gray-300 py-10 overflow-hidden border-t border-gray-800">
     
      <div className="absolute inset-0">
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 400"
          preserveAspectRatio="none"
        >
          <circle cx="100" cy="200" r="200" fill="url(#grad1)">
            <animate
              attributeName="cx"
              values="100;700;100"
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="700" cy="100" r="150" fill="url(#grad2)">
            <animate
              attributeName="cy"
              values="100;300;100"
              dur="18s"
              repeatCount="indefinite"
            />
          </circle>

          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="grad2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

     
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl mb-6font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-[cursive]">
          Developed by{" "}
          <a
            href="https://shreekant-yadav-07.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-pink-400 transition-all duration-300"
          >
            Shreekant Yadav
          </a>
        </h1>

      
        <div className="mt-4 text-lg text-gray-400 font-mono tracking-wide">
          🕒 {time}
        </div>

        <p className="text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} Crafted with ❤️ by Shreekant Yadav
        </p>
      </div>
    </footer>
  );
};
