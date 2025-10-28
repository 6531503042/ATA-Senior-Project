'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  Input,
  Checkbox,
  Link as UiLink,
  Chip,
  Card,
  CardBody,
  CardHeader,
  Spinner,
} from '@heroui/react';
import {
  User,
  EyeClosed,
  Eye,
  Lock,
  AlertCircle,
  LogIn,
  Shield,
  CheckCircle,
} from 'lucide-react';
import Image from 'next/image';

import useAuthStore from '@/stores/authStore';

export default function LoginPage() {
  const { signIn, loading, error, clearError } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: true,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const redirect = searchParams?.get('redirect') || '/';

  // Auto-focus on error
  useEffect(() => {
    if (!loading && error) {
      const el = document.querySelector<HTMLInputElement>('[data-field="username"]');
      el?.focus();
    }
  }, [loading, error]);

  // Memoized handlers
  const toggleVisibility = useCallback(() => setIsVisible(prev => !prev), []);
  
  const handleInputChange = useCallback((field: keyof typeof formData) => 
    (value: string | boolean) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      // Clear field error when user starts typing
      if (fieldErrors[field as keyof typeof fieldErrors]) {
        setFieldErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }, [fieldErrors]
  );

  const validateForm = useCallback(() => {
    const errors: { username?: string; password?: string } = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock((e.nativeEvent as KeyboardEvent).getModifierState?.('CapsLock') ?? false);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;

    try {
      const success = await signIn(formData.username.trim(), formData.password);
      if (success) {
        if (formData.remember) {
          localStorage.setItem('rememberMe', '1');
        } else {
          localStorage.removeItem('rememberMe');
        }
        router.push(redirect);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  }, [formData, validateForm, signIn, clearError, router, redirect]);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!formData.password) return { score: 0, label: '', color: 'default' as const };
    
    let score = 0;
    if (formData.password.length >= 8) score++;
    if (/[A-Z]/.test(formData.password)) score++;
    if (/[0-9]/.test(formData.password)) score++;
    if (/[^A-Za-z0-9]/.test(formData.password)) score++;
    
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['danger', 'warning', 'success', 'success'] as const;
    
    return { 
      score, 
      label: score ? labels[score - 1] : '', 
      color: score ? colors[score - 1] : 'default' as const 
    };
  }, [formData.password]);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-100/20 rounded-full blur-2xl animate-pulse delay-500" />
      </div>
      
      {/* Left side: Brand area with ATA-IT branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative z-10">
        {/* Background decorations - Light theme */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.05),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(168,85,247,0.08),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_rgba(59,130,246,0.02)_0%,_transparent_50%,_rgba(168,85,247,0.03)_100%)]" />
        
        {/* Logo and branding */}
        <div className="relative z-10 flex items-center justify-center">
          <Image 
            src="/ata-it-icon (1).png" 
            alt="ATA-IT Logo" 
            width={300} 
            height={150} 
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-bold leading-tight text-gray-900 mb-6 tracking-tight bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Secure Admin Access
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-10 font-light">
            Access your administrative dashboard with enterprise-grade security. 
            Manage users, monitor systems, and configure settings with confidence.
          </p>
          
          {/* Feature highlights - Enhanced with animations */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-gray-800 group hover:translate-x-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-200">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">Bank-Grade Security</p>
                <p className="text-xs text-gray-600">256-bit encryption & multi-factor authentication</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-800 group hover:translate-x-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-200">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">Role-Based Access</p>
                <p className="text-xs text-gray-600">Granular permissions & audit trails</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-800 group hover:translate-x-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-200">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">Real-time Monitoring</p>
                <p className="text-xs text-gray-600">24/7 system health & performance tracking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-500 text-xs font-medium">
              © 2024 ATA-IT. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Advanced Technology Asia • Enterprise Solutions
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="w-full max-w-md bg-white backdrop-blur-2xl shadow-2xl border border-gray-200 rounded-3xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="flex flex-col items-center gap-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-blue-500/50">
                <Shield className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="group-hover:translate-y-1 transition-transform duration-300">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
                  Administrator Login
                </h2>
                <p className="mt-3 text-gray-600 dark:text-gray-400 font-medium">
                  Enter your credentials to access the system
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardBody className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Username Input */}
              <div className="group">
                <Input
                  isRequired
                  label="Administrator Username"
                  placeholder="Enter your username"
                  size="lg"
                  variant="bordered"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username')(e.target.value)}
                  data-field="username"
                  errorMessage={fieldErrors.username}
                  isInvalid={!!fieldErrors.username}
                  startContent={<User className="text-xl text-gray-500 flex-shrink-0 group-hover:text-blue-500 transition-colors duration-300" />}
                  autoFocus
                  autoComplete="username"
                  classNames={{
                    input: "text-gray-900 dark:text-white font-medium group-hover:text-blue-900 dark:group-hover:text-blue-100",
                    inputWrapper: "border-gray-200 dark:border-gray-700 hover:border-blue-500 focus-within:border-blue-500 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-900/50 dark:to-gray-800/50 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300",
                    label: "text-gray-700 dark:text-gray-300 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300"
                  }}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2 group">
                <Input
                  isRequired
                  label="Administrator Password"
                  placeholder="Enter your password"
                  size="lg"
                  variant="bordered"
                  type={isVisible ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password')(e.target.value)}
                  onKeyUp={handleKeyUp}
                  startContent={<Lock className="text-xl text-gray-500 flex-shrink-0 group-hover:text-blue-500 transition-colors duration-300" />}
                  endContent={
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="focus:outline-none hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md p-1 transition-all duration-300 hover:scale-110"
                      aria-label={isVisible ? 'Hide password' : 'Show password'}
                    >
                      {isVisible ? <Eye className="text-xl text-gray-500 hover:text-blue-500 transition-colors duration-300" /> : <EyeClosed className="text-xl text-gray-500 hover:text-blue-500 transition-colors duration-300" />}
                    </button>
                  }
                  errorMessage={fieldErrors.password}
                  isInvalid={!!fieldErrors.password}
                  autoComplete="current-password"
                  classNames={{
                    input: "text-gray-900 dark:text-white font-medium group-hover:text-blue-900 dark:group-hover:text-blue-100",
                    inputWrapper: "border-gray-200 dark:border-gray-700 hover:border-blue-500 focus-within:border-blue-500 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-900/50 dark:to-gray-800/50 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300",
                    label: "text-gray-700 dark:text-gray-300 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300"
                  }}
                />
                
                {/* Caps Lock Warning */}
                {capsLock && (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Caps Lock is ON</span>
                  </div>
                )}

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="flex items-center justify-between">
                    <Chip 
                      size="sm" 
                      variant="flat" 
                      color={passwordStrength.color}
                    >
                      {passwordStrength.label || 'Weak'}
                    </Chip>
                    <p className="text-xs text-gray-500">
                      Use 8+ characters with a mix of types
                    </p>
                  </div>
                )}
              </div>

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between">
                <Checkbox 
                  isSelected={formData.remember} 
                  onValueChange={(value) => handleInputChange('remember')(value)} 
                  size="sm"
                >
                  Remember me
                </Checkbox>
                <UiLink href="/forgot-password" size="sm" className="text-indigo-600">
                  Forgot password?
                </UiLink>
              </div>

              {/* Error Message */}
              {error && (
                <div 
                  role="alert" 
                  aria-live="assertive" 
                  className="text-red-600 text-sm bg-red-50 dark:bg-red-950/40 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 border border-red-200 dark:border-red-800"
                >
                  <AlertCircle size={18} /> 
                  <div>
                    <p className="font-medium">Authentication Failed</p>
                    <p className="text-xs mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-800 text-white font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-xl hover:scale-105 hover:-translate-y-1 group relative overflow-hidden"
                size="lg"
                type="submit"
                isLoading={loading}
                isDisabled={!formData.username || !formData.password}
                startContent={!loading && <Shield className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />}
              >
                <span className="relative z-10">
                  {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
