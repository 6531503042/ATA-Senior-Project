'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardBody, CardHeader } from '@heroui/react';
import { Eye, EyeOff, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuthContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await signIn(username, password);
      // Navigation will be handled by AuthContext
      // Fallback redirect after 1 second
      setTimeout(() => {
        if (window.location.pathname === '/login') {
          window.location.href = '/';
        }
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),_transparent_60%)]" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Employee Portal</h1>
          <p className="text-white/70">Sign in to access your feedback dashboard</p>
        </div>

        {/* Login Form */}
        <Card className="backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="pb-4">
            <div className="w-full text-center">
              <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
              <p className="text-white/70 text-sm mt-1">Enter your credentials to continue</p>
            </div>
          </CardHeader>
          
          <CardBody className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Username</label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  startContent={<User className="w-4 h-4 text-white/50" />}
                  classNames={{
                    input: "text-white placeholder:text-white/50",
                    inputWrapper: "bg-white/10 border-white/20 hover:border-white/30 focus-within:border-white/50"
                  }}
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">Password</label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  startContent={<Lock className="w-4 h-4 text-white/50" />}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-white/50 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  classNames={{
                    input: "text-white placeholder:text-white/50",
                    inputWrapper: "bg-white/10 border-white/20 hover:border-white/30 focus-within:border-white/50"
                  }}
                  disabled={isLoading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-white/15 hover:bg-white/25 text-white border border-white/20 font-medium"
                isLoading={isLoading}
                disabled={!username || !password}
                endContent={!isLoading && <ArrowRight className="w-4 h-4" />}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Additional Info */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-white/60 text-xs">
                Having trouble signing in? Contact your administrator.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/50 text-xs">
            © 2024 ATA Employee Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
