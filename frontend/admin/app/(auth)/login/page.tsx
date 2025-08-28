"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, EyeClosed, Eye, Lock, AlertCircle } from "lucide-react";
import { Button, Input } from "@heroui/react";

import useAuthStore from "@/hooks/useAuth";

export default function LoginPage() {
  const { signIn, loading, error, clearError } = useAuthStore();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    
    try {
      const success = await signIn(username, password);
      if (success) {
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <form
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
          onSubmit={onSubmit}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-600">
              Sign in to access your account
            </p>
          </div>

          <Input
            label="Username"
            placeholder="Enter your username"
            startContent={
              <User className="text-xl text-gray-400 flex-shrink-0" />
            }
            type="text"
            value={username}
            variant="bordered"
            onChange={(e) => setUsername(e.target.value)}
            isRequired
            size="lg"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            startContent={
              <Lock className="text-xl text-gray-400 flex-shrink-0" />
            }
            endContent={
              <button
                type="button"
                onClick={toggleVisibility}
                className="focus:outline-none"
              >
                {isVisible ? (
                  <Eye className="text-xl text-gray-400" />
                ) : (
                  <EyeClosed className="text-xl text-gray-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            value={password}
            variant="bordered"
            onChange={(e) => setPassword(e.target.value)}
            isRequired
            size="lg"
          />

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <Button 
            className="w-full" 
            color="primary" 
            isLoading={loading} 
            type="submit"
            disabled={!username || !password}
            size="lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}