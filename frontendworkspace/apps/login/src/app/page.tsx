"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import ATA from "@/assets/ata-logo.png";
import Background from "@/assets/background.png";
import { useRouter } from "next/navigation";
import AdminPage from '@admin/page'
import UserPage from '@user/page'

const SignIn = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginUser = async (credentials: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
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
      const data = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      if (data.access_token) {
        showNotification("Login successful!", "success");

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user_info));
        setTimeout(() => {
          const roles = data.user_info.roles;
          if (roles && roles.includes("ROLE_ADMIN")) {
            router.push("http://localhost:3001/");
          } else if (roles && roles.includes("ROLE_USER")) {
            router.push("http://localhost:3002/");
          } else {
            router.push("/");
          }
        }, 1000);
      } else {
        showNotification(
          data.message || "Login failed. Please check your credentials.",
          "error"
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error");
      } else {
        showNotification("An unknown error occurred", "error");
      }
    }
  };

  useEffect(() => {
    // Check if a token is already present in localStorage
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");

    // If the token exists, check the role and navigate
    if (token && user) {
      const userInfo = JSON.parse(user);
      const roles = userInfo.roles;
      if (roles && roles.includes("ROLE_ADMIN")) {
        router.push("http://localhost:3001/");
      } else if (roles && roles.includes("ROLE_USER")) {
        router.push("http://localhost:3002/");
      } else {
        router.push("/"); // Default fallback if no valid role
      }
    }
  }, [router]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-50 relative overflow-hidden">
      <img
        src={Background.src}
        alt="Background"
        className="absolute z-0 inset-0 object-cover w-full h-full"
      />
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

      <div className="bg-white shadow-xl p-8 w-[720px] rounded-lg border border-gray-200 overflow-auto flex flex-col items-center z-10 bg-opacity-95">
        <img src={ATA.src} alt="LOGO" className="w-64 h-auto" />
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6 mt-6">
          Login to your account
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 w-full max-w-md flex flex-col items-center"
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
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-gray-600">
          <a href="#" className="text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
