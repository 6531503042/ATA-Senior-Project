"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Waves from "@/components/ui/Waves";
import ataLogo from "@assets/ata-logo.png";

// Mock login function since the real one isn't available yet
const mockLogin = async (email: string, password: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'admin@atabank.com' && password === 'password') {
        resolve();
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1500);
  });
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    try {
      setIsLoading(true);
      // Call the mock login function
      await mockLogin(email, password);
      
      // If we get here, login was successful
      router.push("/admin/dashboard");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-700 overflow-hidden flex items-center justify-center">
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
      
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-md mx-auto">
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
            <h1 className="text-3xl font-bold text-white mb-1">ATA Bank</h1>
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                      <Mail size={18} />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/10 text-white border-white/20 focus:border-white/40 placeholder:text-white/50"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
                      <Lock size={18} />
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-white/10 text-white border-white/20 focus:border-white/40 placeholder:text-white/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="h-4 w-4 rounded border-white/20 bg-white/10 text-indigo-600"
                    />
                    <label htmlFor="remember-me" className="text-sm text-white/80">
                      Remember me
                    </label>
                  </div>
                  <Link href="/auth/forgot-password" className="text-sm text-white/80 hover:text-white">
                    Forgot password?
                  </Link>
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="primary"
                  className="w-full py-2 rounded transition-all duration-300 shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter>
              <p className="text-center w-full text-white/70 text-sm">
                Need help? Contact <a href="mailto:support@atabank.com" className="text-white hover:underline">IT Support</a>
              </p>
            </CardFooter>
          </Card>
          
          <div className="mt-8 text-center text-white/60 text-xs">
            <p>© {new Date().getFullYear()} ATA Bank. All rights reserved.</p>
            <p className="mt-1">Secure login with end-to-end encryption</p>
          </div>
        </div>
      </div>
      
      <Toaster position="top-right" richColors />
    </div>
  );
}
