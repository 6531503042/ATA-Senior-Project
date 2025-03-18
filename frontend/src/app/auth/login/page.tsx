"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Waves from "@/components/ui/Waves";
import ataLogo from "@assets/ata-logo.png";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  }); 
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
    password: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(formData);
    } catch {
      setFieldErrors({
        username: true,
        password: true,
      });

      setTimeout(() => {
        setFieldErrors({
          username: false,
          password: false,
        });
      }, 600);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

return (
    <div className="relative h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-700 overflow-hidden flex flex-col justify-center items-center">
      <Waves
        lineColor="rgba(255, 255, 255, 0.2)"
        backgroundColor="transparent"
        waveSpeedX={0.015}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.02}
        maxCursorMove={100}
        xGap={16}
        yGap={40}
      />
      
      <div className="container px-4 z-10 flex flex-col items-center">
        <div className="max-w-md w-full">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-64 h-auto mb-6 flex items-center justify-center">
              {/* Glow effect - using multiple layers with different opacities and blur */}
              <div className="absolute inset-0 -m-2 bg-white/40 blur-md rounded-lg"></div>
              <div className="absolute inset-0 -m-3 bg-white/20 blur-lg rounded-lg"></div>
              <div className="absolute inset-0 -m-4 bg-white/10 blur-xl rounded-lg"></div>
              
              {/* Logo container - no background */}
              <div className="relative z-10 flex items-center justify-center">
                <Image 
                  src={ataLogo} 
                  alt="ATA Bank"
                  className="object-contain filter brightness-125 contrast-110"
                  width={240}
                  height={120}
                  priority
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1"></h1>
            <p className="text-white/80 text-center">Feedback Management System</p>
          </div>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-white">Sign In</CardTitle>
              <CardDescription className="text-white/70">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-400/10 border border-red-400/20 rounded-md px-4 py-3 mb-4 text-sm text-red-200">
                  <p>{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Email Address"
                      value={formData.username}
                      onChange={handleChange}
                      className={`pl-10 bg-white/5 border-white/10 text-white ${
                        fieldErrors.username ? "animate-field-shake border-red-400" : ""
                      }`}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 bg-white/5 border-white/10 text-white ${
                        fieldErrors.password ? "animate-field-shake border-red-400" : ""
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded bg-white/5 border-white/10"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label htmlFor="remember" className="text-sm text-white/70">Remember me</label>
                  </div>
                  <Link href="/auth/forgot-password" className="text-sm text-white hover:underline">
                    Forgot password?
                  </Link>
                </div>
                
                <Button
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-center w-full text-sm text-white/70">
                Need help? Contact <a href="#" className="text-white hover:underline">IT Support</a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="text-center py-4 text-white/60 text-sm z-10 absolute bottom-0 left-0 right-0">
        © 2025 ATA Bank. All rights reserved.<br />
        Secure login with end-to-end encryption
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
