
import {  FaStar , FaChalkboardTeacher, FaClipboardList, FaUserFriends, FaCalendarAlt, FaCogs } from "react-icons/fa";

export const UpcomingStudent = () => {
 
  const features = [
    {
      title: "Roommate Chat",
      desc: "Connect with your roommates and hostelmates in real-time for smooth coordination.",
      icon: <FaUserFriends className="w-6 h-6 text-yellow-400" />,
    },
    {
      title: "Digital Notice Board",
      desc: "Stay updated with all hostel notices, events, and announcements digitally.",
      icon: <FaClipboardList className="w-6 h-6 text-yellow-400" />,
    },
    {
      title: "Hostel Events",
      desc: "Get notifications about upcoming cultural and academic events organized by the hostel.",
      icon: <FaCalendarAlt className="w-6 h-6 text-yellow-400" />,
    },
    {
      title: "Feedback System",
      desc: "Easily submit feedback or complaints and track their resolution status.",
      icon: <FaChalkboardTeacher className="w-6 h-6 text-yellow-400" />,
    },
    {
      title: "Smart Rules Tracker",
      desc: "Get reminders about hostel rules and your compliance status in a fun way.",
      icon: <FaCogs className="w-6 h-6 text-yellow-400" />,
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white py-16 px-6 md:px-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400">
          <FaStar className="inline-block mr-2 text-yellow-400 w-7 h-7" />
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
