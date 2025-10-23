import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/Auth.jsx";

import { toast } from "sonner";

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
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

  
      [
        "firstName",
        "lastName",
        "email",
        "phone",
        "gender",
        "dateOfBirth",
        "admissionYear",
        "year",
        "room",
        "image",
      ].forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      data.append("fatherName", formData.fatherName);
      data.append("fatherPhone", formData.fatherPhone);
      data.append("motherName", formData.motherName);
      data.append("motherPhone", formData.motherPhone);

      data.append("street", formData.street);
      data.append("city", formData.city);
      data.append("state", formData.state);
      data.append("zipCode", formData.zipCode);
      data.append("country", formData.country);

      await axiosInstance.post("/admin/addstudents", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Success Toast
      toast.success("🎓 Student added successfully!", {
        description: "Welcome email sent if configured.",
      });

    
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
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
      });
      setImagePreview(null);
    } catch (err) {
      console.error(err);

     
      toast.error("❌ Failed to add student", {
        description: err.response?.data?.message || "Something went wrong.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl w-full mx-auto p-6 bg-gray-900 rounded-3xl shadow-2xl text-white overflow-hidden">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-yellow-400 tracking-wide">
        Add New Student
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
       
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>

       
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
          />
        </div>

      
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
          >
            <option>Male</option>
            <option>Female</option>
          </select>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
          >
            <option>1st</option>
            <option>2nd</option>
            <option>3rd</option>
            <option>4th</option>
          </select>
        </div>

   
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            type="number"
            name="admissionYear"
            value={formData.admissionYear}
            onChange={handleChange}
            placeholder="Admission Year"
            className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
          />
        </div>

       
        <h3 className="text-yellow-400 font-semibold">Parent Details</h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            placeholder="Father's Name"
            className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="text"
            name="fatherPhone"
            value={formData.fatherPhone}
            onChange={handleChange}
            placeholder="Father's Phone"
            className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            placeholder="Mother's Name"
            className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="text"
            name="motherPhone"
            value={formData.motherPhone}
            onChange={handleChange}
            placeholder="Mother's Phone"
            className="flex-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Image Upload */}
        <div className="flex items-center gap-3 w-full">
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="p-2 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-full border-2 border-yellow-400"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-2xl transition duration-300"
        >
          {loading ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
};
