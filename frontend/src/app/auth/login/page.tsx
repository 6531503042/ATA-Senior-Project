"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Logo from "@assets/ata-logo.png";

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
    password: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(formData);
    } catch (err) {
      setFieldErrors({
        username: true,
        password: true
      });
      
      setTimeout(() => {
        setFieldErrors({
          username: false,
          password: false
        });
      }, 600);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-100">
      <div className="w-full max-w-md px-4">
        <Card className="overflow-hidden w-full bg-white shadow-lg rounded-2xl border-0">
          <div className="px-8 pt-8 pb-6 bg-blue-50 border-b border-blue-100">
            <div className="flex justify-center mb-6">
              <Image
                src={Logo}
                alt="ATA Logo" 
                width={56}
                height={56}
                priority
                unoptimized
              />
            </div>
            
            <h2 className="text-2xl font-medium text-slate-800 text-center">Welcome Back</h2>
            <p className="text-center text-slate-500 text-sm mt-1">
              Sign in to access your dashboard
            </p>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-600 px-4 py-3 rounded mb-6 text-sm flex items-start">
                <div className="mr-2 mt-0.5">⚠️</div>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 bg-white border ${
                      fieldErrors.username ? "border-red-400" : "border-slate-200"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${
                      fieldErrors.username ? "animate-field-shake" : ""
                    }`}
                    placeholder="Enter your username"
                  />
                  <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
                    <User className={`h-5 w-5 ${
                      fieldErrors.username ? "text-red-400" : "text-blue-400"
                    }`} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-11 py-3 bg-white border ${
                      fieldErrors.password ? "border-red-400" : "border-slate-200"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${
                      fieldErrors.password ? "animate-field-shake" : ""
                    }`}
                    placeholder="Enter your password"
                  />
                  <div className="absolute left-0 inset-y-0 flex items-center pl-3 pointer-events-none">
                    <Lock className={`h-5 w-5 ${
                      fieldErrors.password ? "text-red-400" : "text-blue-400"
                    }`} />
                  </div>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-0 inset-y-0 pr-3 flex items-center text-slate-500 hover:text-blue-500 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-slate-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-slate-600">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-blue-500 hover:text-blue-700 transition-colors">
                  Forgot password?
                </a>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl mt-2 transition-all duration-200 shadow-sm hover:shadow font-medium"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            
          </div>
        </Card>
      </div>

      <style jsx global>{`
        @keyframes fieldShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-field-shake {
          animation: fieldShake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          animation-iteration-count: 1;
        }
      `}</style>
    </div>
  );
}