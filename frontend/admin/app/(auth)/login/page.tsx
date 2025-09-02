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
  BadgeCheck,
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
      // focus first field with error on auth error
      const el = document.querySelector<HTMLInputElement>('[data-field="username"]');
      el?.focus();
    }
  }, [loading, error]);

  const toggleVisibility = () => setIsVisible(prev => !prev);

  const validate = () => {
    const errs: { username?: string; password?: string } = {};
    if (!username.trim()) errs.username = 'Please enter your username.';
    if (!password) errs.password = 'Please enter your password.';
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
        // optionally persist minimal remember-me flag
        if (remember) localStorage.setItem('rememberMe', '1');
        else localStorage.removeItem('rememberMe');
        router.push(redirect);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const strength = useMemo(() => {
    // Lightweight hint — not a security meter
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const labels = ['Weak', 'Okay', 'Good', 'Strong'];
    return { score, label: score ? labels[score - 1] : '' };
  }, [password]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-indigo-950">
      {/* Left: Hero / Brand panel */}
      <div className="hidden md:flex flex-col justify-between p-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600/90 text-white grid place-items-center shadow-md">
            <KeyRound size={18} />
          </div>
          <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">YourApp</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight text-gray-900 dark:text-gray-100">
            Welcome back 👋
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Sign in to your dashboard to manage users, track activity, and keep your projects moving.
          </p>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>

      {/* Right: Auth card */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md bg-white/80 dark:bg-zinc-900/70 backdrop-blur rounded-2xl shadow-xl p-6 md:p-8 border border-white/60 dark:border-white/10"
          aria-labelledby="login-title"
        >
          <div className="text-center">
            <h2 id="login-title" className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Sign in
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Use your account credentials to continue</p>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <Input
                isRequired
                label="Username"
                placeholder="your.username"
                size="lg"
                variant="bordered"
                value={username}
                onChange={e => setUsername(e.target.value)}
                data-field="username"
                errorMessage={fieldErrors.username}
                isInvalid={!!fieldErrors.username}
                startContent={<User className="text-xl text-gray-400 flex-shrink-0" />}
                aria-describedby={fieldErrors.username ? 'username-error' : undefined}
              />
              {fieldErrors.username && (
                <p id="username-error" className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
              )}
            </div>

            <div>
              <Input
                isRequired
                label="Password"
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
                    onClick={() => setIsVisible(v => !v)}
                    className="focus:outline-none"
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

              {/* Password hint */}
              {password && (
                <div className="mt-2 flex items-center justify-between">
                  <Chip size="sm" variant="flat" color={strength.score >= 3 ? 'success' : strength.score === 2 ? 'warning' : 'danger'}>
                    {strength.label || 'Weak'}
                  </Chip>
                  <p className="text-xs text-gray-500">Use 8+ chars with mix of letters, numbers & symbols.</p>
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
              <div role="alert" aria-live="assertive" className="text-red-600 text-sm bg-red-50 dark:bg-red-950/40 dark:text-red-400 p-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <Button
              className="w-full"
              color="primary"
              size="lg"
              type="submit"
              isLoading={loading}
              isDisabled={!username || !password}
              startContent={<LogIn className="h-4 w-4" />}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>

            <Divider className="my-2" />

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don’t have an account?{' '}
              <UiLink href="/register" className="text-indigo-600">Create one</UiLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
