import React, { useState, useEffect, useContext } from "react";
import { FaMapPin } from "react-icons/fa";
import { AuthContext } from "../Context/Auth";
import {
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMale,
  FaFemale,
  FaUserTie,
} from "react-icons/fa";

export const MyProfile = () => {
  const { axiosInstance } = useContext(AuthContext);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyDetails = async () => {
      try {
        const res = await axiosInstance.get("/student/mydetails");
        setStudent(res.data.student);
      } catch (err) {
        console.error("Error fetching student details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyDetails();
  }, [axiosInstance]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-white text-xl">
        Loading...
      </div>
    );

  if (!student)
    return <div className="text-white p-6">No student data found.</div>;

  const rules = [
    "Respect fellow students and hostel staff at all times.",
    "Maintain cleanliness in your room and common areas.",
    "No loud music or noise after 10 PM.",
    "Guests must be approved by hostel authorities.",
    "Smoking, alcohol, or any illegal activities are strictly prohibited.",
    "Keep your ID card visible inside the hostel premises.",
    "Use electricity and water responsibly.",
    "Report any damages or maintenance issues immediately.",
    "Follow the fire safety and emergency guidelines.",
    "Participate in hostel events and community activities."
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto mb-5 space-y-12">
  
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-3xl shadow-2xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-8 hover:shadow-indigo-500/50 transition-shadow duration-500">
        
        {student.image ? (
          <img
            src={student.image}
            alt={`${student.firstName} ${student.lastName}`}
            className="w-32 h-32 rounded-full border-4 border-gradient-to-r from-indigo-400 to-purple-500 object-cover transform hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-gradient-to-r from-indigo-400 to-purple-500 bg-indigo-700 flex items-center justify-center text-5xl font-bold text-white">
            {student.firstName?.charAt(0).toUpperCase()}
            {student.lastName?.charAt(0).toUpperCase()}
          </div>
        )}

       
        <div className="flex-1 space-y-6">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            {student.firstName} {student.lastName}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-colors">
              <FaEnvelope className="text-indigo-400" />
              <span>{student.email}</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-colors">
              <FaPhone className="text-indigo-400" />
              <span>{student.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-colors">
              <FaBirthdayCake className="text-indigo-400" />
              <span>{new Date(student.dateOfBirth).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-colors">
              {student.gender === "Male" ? (
                <FaMale className="text-indigo-400" />
              ) : (
                <FaFemale className="text-pink-400" />
              )}
              <span>{student.gender}</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-colors">
              <FaCalendarAlt className="text-indigo-400" />
              <span>{student.year} Year</span>
            </div>
            {student.room && (
              <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-colors">
                <FaBuilding className="text-indigo-400" />
                <span>Room {student.room.roomNumber}</span>
              </div>
            )}

            {/* Parent Details */}
            {student.parentDetails?.fatherName && (
              <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-colors">
                <FaUserTie className="text-indigo-400" />
                <span>
                  Father: {student.parentDetails.fatherName} (
                  {student.parentDetails.fatherPhone || "-"})
                </span>
              </div>
            )}
            {student.parentDetails?.motherName && (
              <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-colors">
                <FaUserTie className="text-pink-400" />
                <span>
                  Mother: {student.parentDetails.motherName} (
                  {student.parentDetails.motherPhone || "-"})
                </span>
              </div>
            )}

         
            {student.address && (
              <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-colors col-span-1 sm:col-span-2">
                <FaMapMarkerAlt className="text-indigo-400" />
                <span>
                  
                  {student.address.country}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

  <h2 className="text-xl sm:text-2xl font-bold text-indigo-400 text-center mb-4 sm:mb-6">
    Hostel Rules & Fun Guide
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {rules.map((rule, idx) => (
      <div
        key={idx}
        className={`flex items-start gap-3 bg-gray-800 p-4 rounded-2xl hover:bg-indigo-700 transition-all duration-300 cursor-pointer relative`}
        style={{
          transform: `translateY(${idx * 5}px) rotate(${(idx % 2 === 0 ? 2 : -2)}deg)`,
        }}
      >
        
        <div className="w-8 h-8 flex items-center justify-center bg-indigo-400 text-gray-900 font-bold rounded-full border-2 border-white shadow-md text-sm sm:text-base">
          {idx + 1}
        </div>
      
        <p className="text-gray-200 text-sm sm:text-base font-handwriting leading-snug">
          {rule}
        </p>

       <FaMapPin className="absolute -top-2 -right-2 text-red-500 w-5 h-5 rotate-12" />
      </div>
    ))}
  </div>
</div>
  );
};
