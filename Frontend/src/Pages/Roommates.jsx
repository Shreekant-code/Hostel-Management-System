import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/Auth";
import {
  FaEnvelope,
  FaPhone,
  FaUser,
  FaCalendarAlt,
  FaUserTie,
} from "react-icons/fa";

export const Roommates = () => {
  const { axiosInstance } = useContext(AuthContext);
  const [roommates, setRoommates] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoommates = async () => {
      try {
        const res = await axiosInstance.get("/student/roommates");
        setRoomNumber(res.data.roomNumber);
        setRoommates(res.data.roommates);
      } catch (err) {
        console.error("Error fetching roommates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoommates();
  }, [axiosInstance]);

  if (loading)
    return <p className="text-white text-center mt-20">Loading roommates...</p>;
  if (!roommates.length)
    return <p className="text-white text-center mt-20">No roommates found.</p>;

  return (
    <section className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-extrabold text-indigo-400 text-center mb-6">
        Roommates - Room {roomNumber}
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {roommates.map((mate, idx) => (
          <div
            key={idx}
            className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-2xl shadow-2xl p-5 space-y-3 hover:shadow-indigo-500/50 transition-shadow duration-300"
          >
            <div className="w-24 h-24 rounded-full bg-indigo-700 flex items-center justify-center text-white text-3xl font-bold mx-auto">
              {mate.firstName?.charAt(0).toUpperCase()}
              {mate.lastName?.charAt(0).toUpperCase()}
            </div>

            <h2 className="text-xl font-bold text-center text-indigo-400">
              {mate.firstName} {mate.lastName}
            </h2>

            <div className="space-y-1 text-gray-200 text-sm">
              {mate.email && (
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-indigo-400" /> {mate.email}
                </p>
              )}
              {mate.phone && (
                <p className="flex items-center gap-2">
                  <FaPhone className="text-indigo-400" /> {mate.phone}
                </p>
              )}
              {mate.gender && (
                <p className="flex items-center gap-2">
                  <FaUser className="text-indigo-400" /> {mate.gender}
                </p>
              )}
              {mate.year && (
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-indigo-400" /> Year: {mate.year}
                </p>
              )}
              {mate.admissionYear && (
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-green-400" /> Admission Year:{" "}
                  {mate.admissionYear}
                </p>
              )}
              {(mate.fatherName || mate.motherName) && (
                <div className="space-y-1">
                  {mate.fatherName && (
                    <p className="flex items-center gap-2">
                      <FaUserTie className="text-indigo-400" /> Father:{" "}
                      {mate.fatherName} ({mate.fatherPhone || "-"})
                    </p>
                  )}
                  {mate.motherName && (
                    <p className="flex items-center gap-2">
                      <FaUserTie className="text-pink-400" /> Mother:{" "}
                      {mate.motherName} ({mate.motherPhone || "-"})
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
