"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/app/assets/ata-logo.png";
import Background from "@/app/assets/background.png";

const departments = ["HR", "Engineering", "Marketing", "Finance", "Sales"];
const positions = {
  HR: ["Human Resource", "Recruiter", "HR Manager"],
  Engineering: ["Software Engineer", "System Analyst", "DevOps Engineer"],
  Marketing: ["Marketing Executive", "SEO Specialist", "Brand Manager"],
  Finance: ["Accountant", "Financial Analyst", "CFO"],
  Sales: ["Sales Representative", "Account Manager", "Sales Director"],
};

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    gender: "MALE",
    department: "HR",
    position: "Human Resource",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "department") {
      setFormData({
        ...formData,
        department: value,
        position: positions[value as keyof typeof positions][0], // Auto-select first position
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, roles: ["USER"] }),
      });

      if (!response.ok) {
        throw new Error("Registration failed. Please try again.");
      }

      router.push("/login"); // Redirect to login page after successful registration
    } catch (error) {
      setError(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-br from-white to-purple-100 relative">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={Background}
          alt="Background"
          className="w-full h-full object-cover opacity-50"
          layout="fill"
          priority
        />
      </div>

      <div className="relative z-10 bg-white shadow-lg rounded-2xl p-8 w-96">
        <div className="flex justify-center mb-4">
          <Image src={Logo} alt="Logo" className="w-56 h-auto" priority />
        </div>

        <h2 className="text-center text-2xl font-semibold text-gray-800">
          Create an Account
        </h2>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              name="username"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              name="fullname"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Enter full name"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Gender</label>
            <select
              name="gender"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Department</label>
            <select
              name="department"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              value={formData.department}
              onChange={handleChange}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Position</label>
            <select
              name="position"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              value={formData.position}
              onChange={handleChange}
            >
              {positions[formData.department as keyof typeof positions].map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-purple-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
