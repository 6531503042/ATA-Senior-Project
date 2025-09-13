'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  Input,
  Checkbox,
  Divider,
  Link as UiLink,
  Tooltip,
  Chip,
} from '@heroui/react';
import {
  User,
  EyeClosed,
  Eye,
  Lock,
  AlertCircle,
  LogIn,
  KeyRound,
} from 'lucide-react';

import useAuthStore from '@/stores/authStore';

export default function LoginPage() {
  const { signIn, loading, error, clearError } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [remember, setRemember] = useState(true);
  const [capsLock, setCapsLock] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const redirect = searchParams?.get('redirect') || '/';

  useEffect(() => {
    if (!loading && error) {
      const el = document.querySelector<HTMLInputElement>('[data-field="username"]');
      el?.focus();
    }
  }, [loading, error]);

  const toggleVisibility = () => setIsVisible(prev => !prev);

  const validate = () => {
    const errs: { username?: string; password?: string } = {};
    if (!username.trim()) errs.username = 'Enter your username.';
    if (!password) errs.password = 'Enter your password.';
    if (password && password.length < 6) errs.password = 'Password must be at least 6 characters.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock((e.nativeEvent as KeyboardEvent).getModifierState?.('CapsLock') ?? false);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    try {
      const success = await signIn(username.trim(), password);
      if (success) {
        if (remember) localStorage.setItem('rememberMe', '1');
        else localStorage.removeItem('rememberMe');
        router.push(redirect);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const labels = ['Weak', 'Okay', 'Good', 'Strong'];
    return { score, label: score ? labels[score - 1] : '' };
  }, [password]);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Left side: enhanced brand area with admin focus */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.1),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(168,85,247,0.2),_transparent_60%)]" />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white grid place-items-center shadow-xl">
            <KeyRound size={20} />
          </div>
          <div>
            <span className="text-xl font-bold text-white">Admin Console</span>
            <p className="text-purple-200 text-sm">Management Portal</p>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-bold leading-tight text-white mb-4">
            Secure Admin Access
          </h1>
          <p className="text-purple-100 text-lg leading-relaxed">
            Sign in with your administrator credentials to access the management dashboard, 
            user controls, and system configuration tools.
          </p>
          
          <div className="mt-8 flex items-center gap-4 text-purple-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Secure Authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm">Role-Based Access</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-purple-300 text-sm">
            © {new Date().getFullYear()} — Admin Management System
          </p>
          <p className="text-purple-400 text-xs mt-1">
            Authorized personnel only
          </p>
        </div>
      </div>

      {/* Right side: enhanced form */}
      <div className="flex items-center justify-center p-6 md:p-10 bg-white/5 backdrop-blur-sm">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md bg-white/95 dark:bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-white/10"
          aria-labelledby="login-title"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 id="login-title" className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Administrator Login
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Enter your admin credentials to continue</p>
          </div>

          <div className="space-y-6">
            <div>
              <Input
                isRequired
                label="Admin Username"
                placeholder="Enter your username"
                size="lg"
                variant="bordered"
                value={username}
                onChange={e => setUsername(e.target.value)}
                data-field="username"
                errorMessage={fieldErrors.username}
                isInvalid={!!fieldErrors.username}
                startContent={<User className="text-xl text-gray-400 flex-shrink-0" />}
                aria-describedby={fieldErrors.username ? 'username-error' : undefined}
                autoFocus
                autoComplete="username"
                classNames={{
                  input: "text-gray-900 dark:text-white",
                  inputWrapper: "border-gray-300 dark:border-gray-600 hover:border-purple-500 focus-within:border-purple-500"
                }}
              />
              {fieldErrors.username && (
                <p id="username-error" className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
              )}
            </div>

            <div>
              <Input
                isRequired
                label="Admin Password"
                placeholder="Enter your password"
                size="lg"
                variant="bordered"
                type={isVisible ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyUp={onKeyUp}
                startContent={<Lock className="text-xl text-gray-400 flex-shrink-0" />}
                endContent={
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    className="focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-1 transition-colors"
                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                  >
                    {isVisible ? <Eye className="text-xl text-gray-400" /> : <EyeClosed className="text-xl text-gray-400" />}
                  </button>
                }
                errorMessage={fieldErrors.password}
                isInvalid={!!fieldErrors.password}
                aria-describedby={[
                  fieldErrors.password ? 'password-error' : null,
                  capsLock ? 'capslock-hint' : null,
                ].filter(Boolean).join(' ')}
                autoComplete="current-password"
                classNames={{
                  input: "text-gray-900 dark:text-white",
                  inputWrapper: "border-gray-300 dark:border-gray-600 hover:border-purple-500 focus-within:border-purple-500"
                }}
              />
              <div className="mt-1 flex items-center gap-2 min-h-6">
                {fieldErrors.password && (
                  <p id="password-error" className="text-sm text-red-600">{fieldErrors.password}</p>
                )}
                {capsLock && (
                  <span id="capslock-hint" className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> Caps Lock is ON
                  </span>
                )}
              </div>

              {password && (
                <div className="mt-2 flex items-center justify-between">
                  <Chip size="sm" variant="flat" color={strength.score >= 3 ? 'success' : strength.score === 2 ? 'warning' : 'danger'}>
                    {strength.label || 'Weak'}
                  </Chip>
                  <p className="text-xs text-gray-500">Use 8+ characters with a mix of types.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Checkbox isSelected={remember} onValueChange={setRemember} size="sm">
                Remember me
              </Checkbox>
              <UiLink href="/forgot-password" size="sm" className="text-indigo-600">
                Forgot password?
              </UiLink>
            </div>

            {error && (
              <div role="alert" aria-live="assertive" className="text-red-600 text-sm bg-red-50 dark:bg-red-950/40 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 border border-red-200 dark:border-red-800">
                <AlertCircle size={18} /> 
                <div>
                  <p className="font-medium">Authentication Failed</p>
                  <p className="text-xs mt-1">{error}</p>
                </div>
              </div>
            )}

            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
              type="submit"
              isLoading={loading}
              isDisabled={!username || !password}
              startContent={!loading && <LogIn className="h-5 w-5" />}
            >
              {loading ? 'Authenticating...' : 'Access Admin Panel'}
            </Button>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Secure connection</span>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Admin only</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
