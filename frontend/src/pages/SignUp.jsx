import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Loader, Sparkles, Chrome, Check, Briefcase, UserCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import authService from '../services/auth.service';

export function SignUp({ onNavigate, onSignUp }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [accountType, setAccountType] = useState('coach'); // 'coach' or 'user'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSignUp = async () => {
    // Reset errors
    setErrors({ fullName: '', email: '', password: '', confirmPassword: '', terms: '' });

    // Validate
    let hasErrors = false;
    const newErrors = { fullName: '', email: '', password: '', confirmPassword: '', terms: '' };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      hasErrors = true;
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
      hasErrors = true;
    }

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
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
      hasErrors = true;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      hasErrors = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasErrors = true;
    }

    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the terms and privacy policy';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Sign up with real API
    setIsLoading(true);
    try {
      await authService.register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      onSignUp();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
      setErrors({ ...errors, server: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSignUp();
    }
  };

  const passwordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength, label: 'Medium', color: 'bg-orange-500' };
    return { strength, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = passwordStrength(formData.password);

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

        {/* Sign Up Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 sm:p-8 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">Create Your Coach Account</h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">Join thousands of coaches transforming their practice</p>
          </div>

          <div className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Smith"
                  className={`pl-10 h-11 transition-all ${errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-emerald-500'}`}
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  onKeyPress={handleKeyPress}
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-red-600 animate-slide-up">{errors.fullName}</p>
              )}
            </div>

            {/* Account Type Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Account Type</Label>
              {errors.server && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-900/30">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">
                    {errors.server}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {/* Fitness Coach Option */}
                <button
                  type="button"
                  onClick={() => setAccountType('coach')}
                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    accountType === 'coach'
                      ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700/50 hover:border-emerald-300 dark:hover:border-emerald-600'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      accountType === 'coach'
                        ? 'bg-emerald-100 dark:bg-emerald-900/40'
                        : 'bg-slate-100 dark:bg-slate-600'
                    }`}>
                      <Briefcase className={`w-5 h-5 ${
                        accountType === 'coach'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-500 dark:text-slate-300'
                      }`} />
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-semibold ${
                        accountType === 'coach'
                          ? 'text-emerald-900 dark:text-emerald-300'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>Fitness Coach</p>
                      <p className={`text-xs ${
                        accountType === 'coach'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>Create meal plans</p>
                    </div>
                  </div>
                </button>

                {/* User Option */}
                <button
                  type="button"
                  onClick={() => setAccountType('user')}
                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    accountType === 'user'
                      ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700/50 hover:border-emerald-300 dark:hover:border-emerald-600'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      accountType === 'user'
                        ? 'bg-emerald-100 dark:bg-emerald-900/40'
                        : 'bg-slate-100 dark:bg-slate-600'
                    }`}>
                      <UserCircle className={`w-5 h-5 ${
                        accountType === 'user'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-500 dark:text-slate-300'
                      }`} />
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-semibold ${
                        accountType === 'user'
                          ? 'text-emerald-900 dark:text-emerald-300'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}>User</p>
                      <p className={`text-xs ${
                        accountType === 'user'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>Get your meal plan</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

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
                <p className="text-sm text-red-600 animate-slide-up">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
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
              {formData.password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i < strength.strength ? strength.color : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Password strength: <span className="font-semibold">{strength.label}</span>
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-sm text-red-600 animate-slide-up">{errors.password}</p>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400">Must be at least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  className={`pl-10 pr-10 h-11 transition-all ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-emerald-500'}`}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  onKeyPress={handleKeyPress}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-all hover:scale-110"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-sm text-emerald-600 flex items-center gap-1 animate-slide-up">
                  <Check className="w-4 h-4" />
                  Passwords match
                </p>
              )}
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 animate-slide-up">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms & Privacy */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => {
                    setAcceptedTerms(checked);
                    if (errors.terms && checked) setErrors({ ...errors, terms: '' });
                  }}
                  className="mt-1 border-slate-300"
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <button
                    type="button"
                    className="text-emerald-600 hover:text-emerald-700 font-medium underline"
                    onClick={() => onNavigate('terms')}
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    className="text-emerald-600 hover:text-emerald-700 font-medium underline"
                    onClick={() => onNavigate('privacy')}
                  >
                    Privacy Policy
                  </button>
                </Label>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-600 ml-8 animate-slide-up">{errors.terms}</p>
              )}
            </div>

            {/* Create Account Button */}
            <Button
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-11 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50 hover:shadow-xl hover:shadow-emerald-200/60 dark:hover:shadow-emerald-900/60 transition-all hover:scale-105"
              onClick={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
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

            {/* Social Sign Up */}
            <Button
              variant="outline"
              className="w-full h-11 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-md"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  onSignUp();
                }, 1500);
              }}
              disabled={isLoading}
            >
              <Chrome className="w-5 h-5 mr-2" />
              Sign up with Google
            </Button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors hover:underline"
                >
                  Log in
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