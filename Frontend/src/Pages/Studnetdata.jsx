import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/Auth.jsx";
import { Mail, Phone, Home, User, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

export const StudentData = () => {
  const { axiosInstance } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchRoom, setSearchRoom] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "Male",
    dateOfBirth: "",
    admissionYear: "",
    year: "",
    fatherName: "",
    fatherPhone: "",
    motherName: "",
    motherPhone: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axiosInstance.get("/admin/students");
      setStudents(Array.isArray(res.data.students) ? res.data.students : []);
    } catch (err) {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await axiosInstance.delete(`/admin/students/${id}`);
      if (res.data.success) {
        setStudents((prev) => prev.filter((s) => s._id !== id));
        toast.success("Student deleted successfully!");
      } else toast.error(res.data.message || "Failed to delete student");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete student");
    }
  };

  const openModal = (student = null) => {
    setEditStudent(student);
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        phone: student.phone || "",
        gender: student.gender || "Male",
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split("T")[0] : "",
        admissionYear: student.admissionYear || "",
        year: student.year || "",
        fatherName: student.parentDetails?.fatherName || "",
        fatherPhone: student.parentDetails?.fatherPhone || "",
        motherName: student.parentDetails?.motherName || "",
        motherPhone: student.parentDetails?.motherPhone || "",
      });
    } else {
      setFormData(initialForm);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditStudent(null);
    setFormData(initialForm);
  };

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      parentDetails: {
        fatherName: formData.fatherName,
        fatherPhone: formData.fatherPhone,
        motherName: formData.motherName,
        motherPhone: formData.motherPhone,
      },
    };

    try {
      if (editStudent) {
        const res = await axiosInstance.put(`/admin/students/${editStudent._id}`, payload);
        setStudents((prev) =>
          prev.map((s) => (s._id === editStudent._id ? res.data.student : s))
        );
        toast.success("Student updated successfully!");
      } else {
        const res = await axiosInstance.post("/admin/students", payload);
        setStudents((prev) => [...prev, res.data.student]);
        toast.success("Student added successfully!");
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving student");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.firstName?.toLowerCase().includes(searchName.toLowerCase()) &&
      (searchRoom === "" || (s.room?.roomNumber || "") === searchRoom)
  );

  const boys = filteredStudents.filter((s) => s.gender === "Male");
  const girls = filteredStudents.filter((s) => s.gender === "Female");

  if (loading)
    return <p className="text-center text-white mt-20 text-lg">Loading students...</p>;

  const renderStudentCard = (student) => {
    const initials = `${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`.toUpperCase();
    const createdAt = student.createdAt ? new Date(student.createdAt).toLocaleString() : null;

    return (
      <div
        key={student._id}
        className={`relative p-4 rounded-xl shadow-md border border-gray-700 
        transition-transform hover:scale-[1.02] duration-300 overflow-hidden 
        ${student.gender === "Male"
          ? "bg-gradient-to-br from-gray-800 to-gray-900"
          : "bg-gradient-to-br from-purple-900 to-gray-900"}`}
      >
        <div className="text-green-400 font-bold text-xs mb-2 flex items-center gap-1">
          <User size={14} /> HostelEase
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {student.image ? (
            <img
              src={student.image}
              alt="profile"
              className="w-20 h-20 rounded-full border-2 border-white object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-white bg-gray-700 flex items-center justify-center text-white font-bold text-xl">
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold truncate">
              {student.firstName} {student.lastName}
            </h2>
            {student.email && (
              <p className="text-gray-400 flex items-center gap-1 text-sm break-all">
                <Mail size={14} /> {student.email}
              </p>
            )}
            {student.phone && (
              <p className="text-gray-400 flex items-center gap-1 text-sm break-all">
                <Phone size={14} /> {student.phone}
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 text-sm space-y-1 break-words">
          {student.room?.roomNumber && (
            <p className="flex items-center gap-1"><Home size={14}/> Room: {student.room.roomNumber}</p>
          )}
          <p className="flex items-center gap-1"><User size={14}/> Gender: {student.gender}</p>
          {student.dateOfBirth && (
            <p className="flex items-center gap-1"><Calendar size={14}/> DOB: {new Date(student.dateOfBirth).toLocaleDateString()}</p>
          )}
          {student.admissionYear && <p>Admission Year: {student.admissionYear}</p>}
          {student.year && <p>Year: {student.year}</p>}
          {student.parentDetails?.fatherName && (
            <p>Father: {student.parentDetails.fatherName} ({student.parentDetails.fatherPhone || "-"})</p>
          )}
          {student.parentDetails?.motherName && (
            <p>Mother: {student.parentDetails.motherName} ({student.parentDetails.motherPhone || "-"})</p>
          )}
          {createdAt && (
            <p className="text-gray-400 flex items-center gap-1 mt-1"><Clock size={14}/> Added: {createdAt}</p>
          )}
        </div>

        <div className="flex justify-end mt-4 gap-2 flex-wrap">
          <button
            onClick={() => openModal(student)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm w-full sm:w-auto"
          >
            Update
          </button>
          <button
            onClick={() => handleDelete(student._id)}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm w-full sm:w-auto"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Student ID Cards</h1>

     
      <div className="flex flex-col md:flex-row justify-center mb-8 gap-3">
        <input
          type="text"
          placeholder="Search by First Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-3 rounded-lg bg-gray-100 text-gray-900 w-full md:w-64 focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Search by Room Number"
          value={searchRoom}
          onChange={(e) => setSearchRoom(e.target.value)}
          className="p-3 rounded-lg bg-gray-100 text-gray-900 w-full md:w-64 focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Boys Section */}
      {boys.length > 0 && (
        <>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-green-400">Boys</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {boys.map(renderStudentCard)}
          </div>
        </>
      )}

      {/* Girls Section */}
      {girls.length > 0 && (
        <>
          <h2 className="text-xl sm:text-2xl font-semibold mt-8 mb-4 text-pink-400">Girls</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {girls.map(renderStudentCard)}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-3xl text-white max-h-[90vh] overflow-y-auto border border-gray-700 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-green-400">
                {editStudent ? "Update Student" : "Add Student"}
              </h2>
              <p className="text-gray-300 text-sm flex items-center gap-1">
                <Clock size={16} /> {currentTime.toLocaleTimeString()}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value]) =>
                key === "gender" ? (
                  <select
                    key={key}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <input
                    key={key}
                    type={key === "dateOfBirth" ? "date" : "text"}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500"
                  />
                )
              )}
              <div className="flex justify-end gap-3 flex-wrap sm:col-span-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg w-full sm:w-auto"
                >
                  {editStudent ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
