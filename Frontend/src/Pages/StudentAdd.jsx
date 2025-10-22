import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/Auth.jsx";

export const AddStudentForm = () => {
  const { axiosInstance } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "Male",
    dateOfBirth: "",
    fatherName: "",
    fatherPhone: "",
    motherName: "",
    motherPhone: "",
    admissionYear: "",
    year: "1st",
    room: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));

      await axiosInstance.post("/admin/addstudents", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Student added successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "Male",
        dateOfBirth: "",
        fatherName: "",
        fatherPhone: "",
        motherName: "",
        motherPhone: "",
        admissionYear: "",
        year: "1st",
        room: "",
        image: null,
      });
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error adding student");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 bg-gray-900 rounded-3xl shadow-2xl text-white overflow-hidden">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center text-yellow-400 tracking-wide">
        Add New Student
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Name */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="flex-1 min-w-0 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition duration-300"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="flex-1 min-w-0 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition duration-300"
            required
          />
        </div>

        {/* Email & Phone */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="flex-1 min-w-0 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition duration-300"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="flex-1 min-w-0 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition duration-300"
          />
        </div>

        {/* Gender & Year */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="flex-1 min-w-0 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition duration-300"
          >
            <option>Male</option>
            <option>Female</option>
          </select>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="flex-1 min-w-0 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition duration-300"
          >
            <option>1st</option>
            <option>2nd</option>
            <option>3rd</option>
            <option>4th</option>
          </select>
        </div>

        {/* Admission Year & DOB */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <input
            type="number"
            name="admissionYear"
            value={formData.admissionYear}
            onChange={handleChange}
            placeholder="Admission Year"
            className="flex-1 min-w-0 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition duration-300"
            required
          />
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="flex-1 min-w-0 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition duration-300"
          />
        </div>

        {/* Parent Details */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            placeholder="Father's Name"
            className="flex-1 min-w-0 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition duration-300"
          />
          <input
            type="text"
            name="fatherPhone"
            value={formData.fatherPhone}
            onChange={handleChange}
            placeholder="Father's Phone"
            className="flex-1 min-w-0 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition duration-300"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <input
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            placeholder="Mother's Name"
            className="flex-1 min-w-0 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition duration-300"
          />
          <input
            type="text"
            name="motherPhone"
            value={formData.motherPhone}
            onChange={handleChange}
            placeholder="Mother's Phone"
            className="flex-1 min-w-0 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition duration-300"
          />
        </div>

        {/* Room & Image */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full">
         
          <div className="flex-1 flex gap-3 items-center min-w-0">
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="flex-1 min-w-0 p-2 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition duration-300"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-full border-2 border-yellow-400 flex-shrink-0"
              />
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-2xl transition duration-300"
        >
          {loading ? "Adding..." : "Add Student"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-green-400 font-semibold">{message}</p>
      )}
    </div>
  );
};
