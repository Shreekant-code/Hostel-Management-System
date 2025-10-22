import React, { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../Context/Auth.jsx";
import { BarChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,CartesianGrid,XAxis,YAxis,Bar,PieChart } from "recharts";

export const AnalysisAdmin = () => {
  const { axiosInstance } = useContext(AuthContext);
  const [roomsData, setRoomsData] = useState({ girlsWing: [], boysWing: [] });
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalData, setModalData] = useState(null);

  // Fetch rooms function
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

  if (loading) return <div className="text-white text-center mt-10 text-xl">Loading...</div>;

  const allRooms = [...roomsData.boysWing, ...roomsData.girlsWing];
  const totalRooms = allRooms.length;
  const totalStudents = allRooms.reduce((acc, r) => acc + r.students.length, 0);
  const boysStudents = roomsData.boysWing.reduce((acc, r) => acc + r.students.length, 0);
  const girlsStudents = roomsData.girlsWing.reduce((acc, r) => acc + r.students.length, 0);

  const COLORS = ["#FF4D4F", "#FAAD14", "#52C41A"];
  const CAPCOLORS = ["#1890FF", "#13C2C2"];

  const computeChartData = (rooms) => {
    let filled = 0, partial = 0, empty = 0;
    rooms.forEach(r => {
      const s = r.students.length;
      if (s >= r.capacity) filled++;
      else if (s > 0) partial++;
      else empty++;
    });
    return [
      { name: "Filled", value: filled },
      { name: "Partial", value: partial },
      { name: "Empty", value: empty }
    ];
  };

  const boysChartData = computeChartData(roomsData.boysWing);
  const girlsChartData = computeChartData(roomsData.girlsWing);

  const getCapacityStats = (rooms) => {
    const cap2 = rooms.filter(r => r.capacity === 2).map(r => r.roomNumber);
    const cap3 = rooms.filter(r => r.capacity === 3).map(r => r.roomNumber);
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
    <div className="w-full bg-gray-900 text-white p-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 p-6 rounded-xl shadow-lg text-center">
          <p className="text-gray-900 font-semibold">Total Rooms</p>
          <p className="text-2xl font-bold">{totalRooms}</p>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 p-6 rounded-xl shadow-lg text-center">
          <p className="text-gray-900 font-semibold">Total Students</p>
          <p className="text-2xl font-bold">{totalStudents}</p>
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-pink-400 p-6 rounded-xl shadow-lg text-center">
          <p className="text-gray-900 font-semibold">Boys Students</p>
          <p className="text-2xl font-bold">{boysStudents}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-400 p-6 rounded-xl shadow-lg text-center">
          <p className="text-gray-900 font-semibold">Girls Students</p>
          <p className="text-2xl font-bold">{girlsStudents}</p>
        </div>
      </div>
    {/* 2-Bed vs 3-Bed Charts */}
<div className="flex flex-col md:flex-row gap-6 mb-8">
  {/* Girls Bed Type */}
  <div className="flex-1 bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg min-h-[250px]">
    <h2 className="text-xl font-bold mb-4 text-center md:text-left text-pink-400">
      Girls Wing Bed Type
    </h2>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={girlsBedChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="name" tick={{ fill: "#fff" }} />
        <YAxis tick={{ fill: "#fff" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#f472b6" radius={[8, 8, 0, 0]}>
          {girlsBedChartData.map((entry, index) => (
            <Cell key={`cell-g-bar-${index}`} fill={CAPCOLORS[index % CAPCOLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Boys Bed Type */}
  <div className="flex-1 bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg min-h-[250px]">
    <h2 className="text-xl font-bold mb-4 text-center md:text-left text-yellow-400">
      Boys Wing Bed Type
    </h2>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={boysBedChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="name" tick={{ fill: "#fff" }} />
        <YAxis tick={{ fill: "#fff" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#facc15" radius={[8, 8, 0, 0]}>
          {boysBedChartData.map((entry, index) => (
            <Cell key={`cell-b-bar-${index}`} fill={CAPCOLORS[index % CAPCOLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>


    
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Girls */}
        <div className="flex-1 bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg min-h-[250px]">
          <h2 className="text-xl font-bold mb-4 text-center md:text-left text-pink-400">
            Girls Wing Occupancy
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={girlsChartData} dataKey="value" nameKey="name" outerRadius={80} label>
                {girlsChartData.map((entry, index) => (
                  <Cell key={`cell-g-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Boys */}
        <div className="flex-1 bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg min-h-[250px]">
          <h2 className="text-xl font-bold mb-4 text-center md:text-left text-yellow-400">
            Boys Wing Occupancy
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={boysChartData} dataKey="value" nameKey="name" outerRadius={80} label>
                {boysChartData.map((entry, index) => (
                  <Cell key={`cell-b-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rooms */}
      <div className="flex flex-col md:flex-row gap-6">
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
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-6 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl animate-fade-in relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-yellow-400">
                Room {modalData?.roomNumber || selectedRoom} Students
              </h3>
              <button onClick={closeModal} className="text-white text-xl font-bold hover:text-red-500 transition">&times;</button>
            </div>

            {modalData?.students && modalData.students.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {modalData.students.map((student) => (
                  <div key={student.id} className="p-4 bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
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
