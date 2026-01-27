import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Loader, 
  Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { GoogleLogin } from '@react-oauth/google';
import authService from '@/services/auth.service';

const Login = () => {
  const navigate = useNavigate();
  
  // States
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
    server: '',
  });

  // Validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error when user types
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '', server: '' }));
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setErrors({ email: '', password: '', server: '' });

    // Client-side Validation
    let hasErrors = false;
    const newErrors = { email: '', password: '', server: '' };

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
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.login(formData, rememberMe);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors(prev => ({ ...prev, server: result.message || 'Login failed' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, server: 'An unexpected error occurred' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const result = await authService.googleLogin(credentialResponse.credential, rememberMe);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, server: 'Google login failed' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        
        {/* Brand Logo Section */}
        <div className="text-center space-y-2">
          <div 
            className="flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate('/')}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              AI Nutritionist
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm">Professional Fitness Coaching Tools</p>
        </div>

        <Card className="border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to continue to your dashboard
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {/* Server Errors */}
              {errors.server && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center font-medium animate-in fade-in zoom-in duration-300">
                  {errors.server}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="coach@example.com"
                    className={`pl-10 h-11 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-emerald-500'}`}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 h-11 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-emerald-500'}`}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-11 shadow-lg transition-all hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : 'Sign In'}
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-800 px-2 text-slate-500">Or continue with</span>
                </div>
              </div>

              {/* Google Login Integration */}
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setErrors(prev => ({ ...prev, server: 'Google login failed' }))}
                  useOneTap
                  theme="filled_blue"
                  shape="pill"
                  width="320"
                />
              </div>

              <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center text-xs text-slate-400">
          © 2025 AI Nutritionist. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;