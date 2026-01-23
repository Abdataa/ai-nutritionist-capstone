import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Loader, Sparkles, Chrome } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import authService from '../services/auth.service';

export function Login({ onNavigate, onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Reset errors
    setErrors({ email: '', password: '' });

    // Validate
    let hasErrors = false;
    const newErrors = { email: '', password: '' };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      hasErrors = true;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      hasErrors = true;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Login with real API
    setIsLoading(true);
    try {
      await authService.login(formData.email, formData.password);
      onLogin();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      setErrors({ ...errors, server: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950/20 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8 animate-slide-up">
          <div className="flex items-center justify-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate('landing')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50 transition-transform hover:scale-105">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">AI Nutritionist</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">For Professional Fitness Coaches</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 sm:p-8 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Welcome Back</h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">Sign in to continue to your dashboard</p>
          </div>

          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="coach@example.com"
                  className={`pl-10 h-11 transition-all ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-emerald-500'}`}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  onKeyPress={handleKeyPress}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1 animate-slide-up">
                  {errors.email}
                </p>
              )}
            </div>

            {errors.server && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-900/30">
                <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">
                  {errors.server}
                </p>
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`pl-10 pr-10 h-11 transition-all ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-emerald-500'}`}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  onKeyPress={handleKeyPress}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-all hover:scale-110"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1 animate-slide-up">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked)}
                  className="border-slate-300 dark:border-slate-600"
                />
                <Label htmlFor="remember" className="text-sm cursor-pointer hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors hover:underline"
                onClick={() => onNavigate('forgot-password')}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-11 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50 hover:shadow-xl hover:shadow-emerald-200/60 dark:hover:shadow-emerald-900/60 transition-all hover:scale-105"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Log In'
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">or</span>
              </div>
            </div>

            {/* Social Login */}
            <Button
              variant="outline"
              className="w-full h-11 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-md"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  onLogin();
                }, 1500);
              }}
              disabled={isLoading}
            >
              <Chrome className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <button
                  onClick={() => onNavigate('signup')}
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-slate-500 dark:text-slate-400 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p>© 2025 AI Nutritionist. Built for professional coaches.</p>
        </div>
      </div>
    </div>
  );
}