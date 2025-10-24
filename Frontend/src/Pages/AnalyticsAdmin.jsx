import React, { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../Context/Auth.jsx";
import {
  BarChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  PieChart,
} from "recharts";
import CountUp from "react-countup";

export const AnalysisAdmin = () => {
  const { axiosInstance } = useContext(AuthContext);
  const [roomsData, setRoomsData] = useState({ girlsWing: [], boysWing: [] });
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalData, setModalData] = useState(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/rooms");
      setRoomsData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const getRoomStatus = (room) => {
    const filled = room.students.length;
    if (filled >= room.capacity) return "filled";
    if (filled > 0) return "partial";
    return "empty";
  };

  const handleRoomClick = async (roomId) => {
    try {
      const res = await axiosInstance.get(`/admin/rooms/${roomId}`);
      setModalData(res.data);
      setSelectedRoom(roomId);
    } catch (err) {
      console.error(err);
      setModalData({ students: [] });
      setSelectedRoom(roomId);
    }
  };

  const closeModal = () => {
    setSelectedRoom(null);
    setModalData(null);
  };

  if (loading)
    return (
      <div className="text-white text-center mt-10 text-xl">Loading...</div>
    );

  const allRooms = [...roomsData.boysWing, ...roomsData.girlsWing];
  const totalRooms = allRooms.length;
  const totalStudents = allRooms.reduce((acc, r) => acc + r.students.length, 0);
  const boysStudents = roomsData.boysWing.reduce((acc, r) => acc + r.students.length, 0);
  const girlsStudents = roomsData.girlsWing.reduce((acc, r) => acc + r.students.length, 0);
  const boysSeats = roomsData.boysWing.reduce((acc, r) => acc + r.capacity, 0);
  const girlsSeats = roomsData.girlsWing.reduce((acc, r) => acc + r.capacity, 0);

  const COLORS = ["#FF4D4F", "#FAAD14", "#52C41A"];
  const CAPCOLORS = ["#1890FF", "#13C2C2"];

  const computeChartData = (rooms) => {
    let filled = 0, partial = 0, empty = 0;
    rooms.forEach((r) => {
      const s = r.students.length;
      if (s >= r.capacity) filled++;
      else if (s > 0) partial++;
      else empty++;
    });
    return [
      { name: "Filled", value: filled },
      { name: "Partial", value: partial },
      { name: "Empty", value: empty },
    ];
  };

  const boysChartData = computeChartData(roomsData.boysWing);
  const girlsChartData = computeChartData(roomsData.girlsWing);

  const getCapacityStats = (rooms) => {
    const cap2 = rooms.filter((r) => r.capacity === 2).map((r) => r.roomNumber);
    const cap3 = rooms.filter((r) => r.capacity === 3).map((r) => r.roomNumber);
    return { cap2, cap3 };
  };

  const girlsCapacity = getCapacityStats(roomsData.girlsWing);
  const boysCapacity = getCapacityStats(roomsData.boysWing);

  const boysBedChartData = [
    { name: "2-Bed", value: boysCapacity.cap2.length },
    { name: "3-Bed", value: boysCapacity.cap3.length },
  ];
  const girlsBedChartData = [
    { name: "2-Bed", value: girlsCapacity.cap2.length },
    { name: "3-Bed", value: girlsCapacity.cap3.length },
  ];

  const renderRoom = (room) => (
    <div
      key={room.id}
      className={`w-16 h-16 flex items-center justify-center rounded-md shadow-lg cursor-pointer ${
        getRoomStatus(room) === "filled"
          ? "bg-red-600"
          : getRoomStatus(room) === "partial"
          ? "bg-orange-500"
          : "bg-green-600"
      } text-sm font-bold text-white`}
      title={`Room ${room.roomNumber} - ${room.students.length}/${room.capacity}`}
      onClick={() => handleRoomClick(room.id)}
    >
      {room.roomNumber}
    </div>
  );

  return (
    <div className="w-full bg-gray-900 text-white p-4 md:p-6 lg:p-10">
     
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 p-6 rounded-xl shadow-lg text-center">
          <p className="text-gray-900 font-semibold">Total Rooms</p>
          <p className="text-3xl font-bold"><CountUp end={totalRooms} duration={1.5} /></p>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 p-6 rounded-xl shadow-lg text-center">
          <p className="text-gray-900 font-semibold">Total Students</p>
          <p className="text-3xl font-bold"><CountUp end={totalStudents} duration={1.5} /></p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-6 rounded-xl shadow-lg text-center">
          <p className="text-gray-900 font-semibold">Total Boys Beds</p>
          <p className="text-3xl font-bold"><CountUp end={boysSeats} duration={1.5} /></p>
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-pink-400 p-6 rounded-xl shadow-lg text-center">
          <p className="text-gray-900 font-semibold">Total Girls Beds</p>
          <p className="text-3xl font-bold"><CountUp end={girlsSeats} duration={1.5} /></p>
        </div>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 text-center shadow-lg">
          <h3 className="text-2xl font-bold text-yellow-400 mb-3">Boys Added</h3>
          <p className="text-4xl font-extrabold text-white"><CountUp end={boysStudents} duration={1.5} /></p>
          <p className="text-gray-400 mt-2">students currently in hostel</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 text-center shadow-lg">
          <h3 className="text-2xl font-bold text-pink-400 mb-3">Girls Added</h3>
          <p className="text-4xl font-extrabold text-white"><CountUp end={girlsStudents} duration={1.5} /></p>
          <p className="text-gray-400 mt-2">students currently in hostel</p>
        </div>
      </div>

      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-pink-400 text-center">Girls Wing Bed Type</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={girlsBedChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" tick={{ fill: "#fff" }} />
              <YAxis tick={{ fill: "#fff" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {girlsBedChartData.map((entry, index) => (
                  <Cell key={`cell-g-bar-${index}`} fill={CAPCOLORS[index % CAPCOLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-yellow-400 text-center">Boys Wing Bed Type</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={boysBedChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" tick={{ fill: "#fff" }} />
              <YAxis tick={{ fill: "#fff" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {boysBedChartData.map((entry, index) => (
                  <Cell key={`cell-b-bar-${index}`} fill={CAPCOLORS[index % CAPCOLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Occupancy Pie Charts */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-pink-400 text-center">Girls Wing Occupancy</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={girlsChartData} dataKey="value" nameKey="name" outerRadius={80} label>
                {girlsChartData.map((entry, index) => (
                  <Cell key={`cell-g-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-yellow-400 text-center">Boys Wing Occupancy</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={boysChartData} dataKey="value" nameKey="name" outerRadius={80} label>
                {boysChartData.map((entry, index) => (
                  <Cell key={`cell-b-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">Girls Wing</h2>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">{roomsData.girlsWing.map(renderRoom)}</div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">Boys Wing</h2>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">{roomsData.boysWing.map(renderRoom)}</div>
        </div>
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-6 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-yellow-400">
                Room {modalData?.roomNumber || selectedRoom} Students
              </h3>
              <button onClick={closeModal} className="text-white text-xl font-bold hover:text-red-500 transition">&times;</button>
            </div>
            {modalData?.students && modalData.students.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {modalData.students.map((student) => (
                  <div key={student.id} className="p-4 bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition">
                    <p className="text-lg font-semibold text-white">{student.name}</p>
                    <p className="text-sm text-gray-300"><span className="font-semibold">Email:</span> {student.email}</p>
                    <p className="text-sm text-gray-300"><span className="font-semibold">Phone:</span> {student.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300 text-center mt-4">No students available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
