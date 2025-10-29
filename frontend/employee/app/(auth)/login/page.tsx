'use client';

import { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Input,
  Checkbox,
  Link as UiLink,
  Chip,
  Card,
  CardBody,
  CardHeader,
} from '@heroui/react';
import {
  User,
  EyeClosed,
  Eye,
  Lock,
  AlertCircle,
  CheckCircle,
  Briefcase,
  Shield,
} from 'lucide-react';
import Image from 'next/image';
import { useAuthContext } from '../../../contexts/AuthContext';

export default function EmployeeLoginPage() {
  const router = useRouter();
  const { signIn } = useAuthContext();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: true,
  });

  const [isVisible, setIsVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleVisibility = useCallback(() => setIsVisible(prev => !prev), []);
  const handleInputChange = useCallback(
    (field: keyof typeof formData) => (value: string | boolean) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      setError(null);
    },
    [],
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      setCapsLock(
        (e.nativeEvent as KeyboardEvent).getModifierState?.('CapsLock') ??
          false,
      );
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!formData.username || !formData.password) {
        setError('Please fill in all fields');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await signIn(formData.username.trim(), formData.password);
        router.push('/feedback-center');
      } catch (err: any) {
        setError(err.message || 'Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [formData, signIn, router],
  );

  const passwordStrength = useMemo(() => {
    if (!formData.password)
      return { score: 0, label: '', color: 'default' as const };

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
      color: score ? colors[score - 1] : ('default' as const),
    };
  }, [formData.password]);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white relative overflow-hidden">
      {/* Soft Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* LEFT SIDE: INFO PANEL */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative z-10">
        {/* Branding */}
        <div className="flex justify-center mb-10">
          <Image
            src="/ata-icon-white.png"
            alt="ATA-IT Logo"
            width={300}
            height={150}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Description */}
        <div className="max-w-lg space-y-8">
          <h2 className="text-5xl font-bold leading-tight text-gray-900 mb-6 tracking-tight bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Employee Portal
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed font-light">
            Access your personal workspace to manage feedback, track progress,
            and grow with your team.
          </p>

          {/* Features */}
          <div className="space-y-6 pt-2">
            <div className="flex items-center gap-4 text-gray-800">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-lg shadow-green-200">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">Easy Feedback</p>
                <p className="text-xs text-gray-600">
                  Submit and review feedback seamlessly
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-800">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center shadow-lg shadow-blue-200">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">Employee Insights</p>
                <p className="text-xs text-gray-600">
                  Track your performance and personal growth
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-800">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shadow-lg shadow-amber-200">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">Secure Login</p>
                <p className="text-xs text-gray-600">
                  Your data is safely protected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-10 border-t border-gray-100">
          <p className="text-gray-500 text-xs font-medium">
            © 2024 ATA-IT Employee Portal. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Empowering teamwork & growth
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="w-full max-w-md bg-white backdrop-blur-2xl shadow-2xl border border-gray-200 rounded-3xl">
          <CardHeader className="flex flex-col items-center justify-center text-center pb-6 pt-8">
            <div className="flex flex-col items-center justify-center gap-6 w-full">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex flex-col items-center justify-center w-full">
                <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="mt-3 text-gray-600 font-medium">
                  Sign in to access your employee dashboard
                </p>
              </div>
            </div>
          </CardHeader>

          <CardBody className="space-y-6 py-6">
  <form onSubmit={handleSubmit} className="space-y-6">
    {/* Username */}
    <div className="flex flex-col gap-2">
      <label
        htmlFor="username"
        className="text-sm font-medium text-gray-700 flex items-center gap-1"
      >
        Employee Username
        <span className="text-red-500">*</span>
      </label>
      <Input
        id="username"
        placeholder="Enter your username"
        variant="bordered"
        size="lg"
        required
        value={formData.username}
        onChange={(e) => handleInputChange("username")(e.target.value)}
        startContent={<User className="text-gray-500" />}
        classNames={{
          inputWrapper:
            "border-gray-200 bg-gray-50 hover:border-blue-400 focus-within:border-blue-500 transition-colors",
          input: "text-gray-900 font-medium",
        }}
      />
    </div>

    {/* Password */}
    <div className="flex flex-col gap-2">
      <label
        htmlFor="password"
        className="text-sm font-medium text-gray-700 flex items-center gap-1"
      >
        Employee Password
        <span className="text-red-500">*</span>
      </label>
      <Input
        id="password"
        placeholder="Enter your password"
        type={isVisible ? "text" : "password"}
        variant="bordered"
        size="lg"
        required
        value={formData.password}
        onChange={(e) => handleInputChange("password")(e.target.value)}
        onKeyUp={handleKeyUp}
        startContent={<Lock className="text-gray-500" />}
        endContent={
          <button
            type="button"
            onClick={toggleVisibility}
            className="focus:outline-none"
          >
            {isVisible ? (
              <Eye className="text-gray-500" />
            ) : (
              <EyeClosed className="text-gray-500" />
            )}
          </button>
        }
        classNames={{
          inputWrapper:
            "border-gray-200 bg-gray-50 hover:border-blue-400 focus-within:border-blue-500 transition-colors",
          input: "text-gray-900 font-medium",
        }}
      />

      {capsLock && (
        <div className="flex items-center gap-1 text-xs text-amber-600">
          <AlertCircle className="h-4 w-4" />
          <span>Caps Lock is ON</span>
        </div>
      )}

      {formData.password && (
        <div className="flex items-center justify-between">
          <Chip size="sm" variant="flat" color={passwordStrength.color}>
            {passwordStrength.label || "Weak"}
          </Chip>
          <p className="text-xs text-gray-500">
            Use 8+ characters with a mix of types
          </p>
        </div>
      )}
    </div>

    {/* Remember me + Forgot password */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Checkbox
          isSelected={formData.remember}
          onValueChange={(v) => handleInputChange("remember")(v)}
          size="sm"
          className='h-4 w-4 rounded-4xl'
        />
        <span className="text-sm text-gray-700 select-none">Remember me</span>
      </div>
      <UiLink href="/forgot-password" className="text-sm text-indigo-600">
        Forgot password?
      </UiLink>
    </div>

    {/* Error Message */}
    {error && (
      <div className="text-red-600 text-sm bg-red-50 p-4 rounded-xl flex items-center gap-3 border border-red-200">
        <AlertCircle size={18} />
        <div>
          <p className="font-medium">Login Failed</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </div>
    )}

    {/* Submit Button */}
    <Button
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg rounded-xl"
      size="lg"
      type="submit"
      isLoading={isLoading}
      startContent={!isLoading && <Shield className="h-5 w-5" />}
    >
      {isLoading ? "Signing in..." : "Access Employee Portal"}
    </Button>
  </form>
</CardBody>

        </Card>
      </div>
    </div>
  );
}
