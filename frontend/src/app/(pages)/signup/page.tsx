"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import ATA from "@/app/assets/ata-logo.png";
import Background from "@/app/assets/background.png";
import { useRouter } from "next/navigation";

const SignUp = () => {
const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    gender: "",
    department: "HR",
    position: "Employee",
    roles: ["USER"],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
    visible: boolean;
  }>({ message: "", type: "info", visible: false });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.fullname.trim()) newErrors.fullname = "Full Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      newErrors.email = "Valid email is required";

    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerUser = async (userData: {
    username: string;
    fullname: string;
    email: string;
    password: string;
    gender: string;
    department: string;
    position: string;
    roles: string[];
  }) => {
    try {
      const response = await fetch("http://localhost:8081/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      throw new Error("Error connecting to the server");
    }
  };

  const showNotification = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 5000);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification("Please fix the errors in the form", "error");
      return;
    }

    try {
      const data = await registerUser(formData);
      if (data.access_token) {
        showNotification("Registration successful!", "success");
        console.log("User Info:", data.user_info);
        // Could redirect here: router.push('/login');
      } else {
        showNotification(data.message || "Registration failed", "error");
      }
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error");
      } else {
        showNotification("An unknown error occurred", "error");
      }
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-50 relative overflow-hidden">
      <img src={Background.src} className="absolute z-0 inset-0 object-cover w-screen h-screen" />
      {/* Notification Toast */}
      {notification.visible && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-sm animate-in fade-in slide-in-from-top-5 z-50 flex items-center gap-3 ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : notification.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : notification.type === "error" ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <Info className="h-5 w-5" />
          )}
          <p>{notification.message}</p>
        </div>
      )}

      <div className="bg-white shadow-xl p-8 w-[720px] rounded-lg border border-gray-200 overflow-auto flex flex-col items-center z-50">
        <img src={ATA.src} alt="LOGO" className="w-64 h-auto" />
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6 mt-6">
          Create Your Account
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full flex flex-col items-center"
        >
          <div className="space-y-1 w-full">
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={`p-3 border rounded-md outline-none w-full focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.username ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          <div className="space-y-1 w-full">
            <input
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              className={`p-3 border rounded-md outline-none w-full focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.fullname ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm">{errors.fullname}</p>
            )}
          </div>

          <div className="space-y-1 w-full">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`p-3 border rounded-md outline-none w-full focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1 w-full">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`p-3 border rounded-md outline-none w-full focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="space-y-1 w-full">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md outline-none w-full focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-1 w-full">
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md outline-none w-full focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div className="space-y-1 w-full">
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md outline-none w-full focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Director">Director</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-max bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
