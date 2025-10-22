import React from "react";
import {
  Sparkles,
  Users,
  Building2,
  BarChart3,
  Bell,
  Settings,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

export const UpcomingAdmin = () => {
  const features = [
    {
      icon: <Users className="text-pink-400 w-8 h-8" />,
      title: "Smart Student Insights",
      desc: "AI-powered student analytics and attendance visualization with detailed reports.",
    },
    {
      icon: <Building2 className="text-yellow-400 w-8 h-8" />,
      title: "Hostel Digital Map",
      desc: "Interactive map showing room allocations, floor layouts, and maintenance areas.",
    },
    {
      icon: <BarChart3 className="text-green-400 w-8 h-8" />,
      title: "Advanced Analytics Dashboard",
      desc: "Real-time hostel occupancy, student distribution, and performance tracking.",
    },
    {
      icon: <Bell className="text-blue-400 w-8 h-8" />,
      title: "Smart Notifications",
      desc: "Automated email & push alerts for dues, room changes, or upcoming inspections.",
    },
    {
      icon: <CalendarDays className="text-purple-400 w-8 h-8" />,
      title: "Event Scheduler",
      desc: "Plan hostel events and student meetings with reminders and calendar sync.",
    },
    {
      icon: <ShieldCheck className="text-orange-400 w-8 h-8" />,
      title: "Enhanced Security System",
      desc: "Face-recognition-based entry and digital visitor logs for enhanced safety.",
    },
    {
      icon: <Settings className="text-cyan-400 w-8 h-8" />,
      title: "AI Maintenance Tracker",
      desc: "Predictive maintenance suggestions using student feedback and usage trends.",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white py-16 px-6 md:px-20">
     
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400">
          <Sparkles className="inline-block mr-2 text-yellow-400 w-7 h-7" />
          Upcoming Features
        </h1>
        <p className="text-gray-400 mt-3 text-lg">
          Exciting innovations are on the way to make HostelEase even smarter ✨
        </p>
      </div>

     
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-700 hover:shadow-pink-500/20 hover:border-pink-400 transition-all"
          >
            <div className="flex items-center mb-4">
              {feature.icon}
              <h3 className="text-xl font-semibold ml-3">{feature.title}</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

     
      <div className="mt-16 text-center">
        <p className="text-gray-500">
          🚀 Stay tuned — these features will roll out soon to make hostel
          management seamless and fun!
        </p>
      </div>
    </section>
  );
};
