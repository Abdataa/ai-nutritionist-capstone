import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Loader, 
  Sparkles, 
  Check, 
  Briefcase, 
  UserCircle 
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

const SignUp = () => {
  const navigate = useNavigate();

  // States
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

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Password Strength Logic
  const getPasswordStrength = (password) => {
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

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!acceptedTerms) newErrors.terms = 'You must accept the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccess('');

    try {
      const result = await authService.register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: accountType
      });

      if (result.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrors({ server: result.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ server: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const result = await authService.googleLogin(credentialResponse.credential);
      if (result.success) navigate('/dashboard');
    } catch (error) {
      setErrors({ server: 'Google sign up failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950/20 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        
        {/* Logo Section */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">AI Nutritionist</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm">Join the future of professional nutrition coaching</p>
        </div>

        <Card className="shadow-xl border-slate-100 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">Sign up to get started</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Status Messages */}
              {errors.server && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center font-medium border border-red-100">{errors.server}</div>}
              {success && <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm text-center font-medium border border-green-100">{success}</div>}

              {/* Account Type Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">I am a...</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType('coach')}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${accountType === 'coach' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-emerald-200'}`}
                  >
                    <Briefcase className={`w-5 h-5 mb-1 ${accountType === 'coach' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold">Fitness Coach</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('user')}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${accountType === 'user' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-emerald-200'}`}
                  >
                    <UserCircle className={`w-5 h-5 mb-1 ${accountType === 'user' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold">Individual</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="fullName" name="fullName" placeholder="John Doe" className="pl-10" value={formData.fullName} onChange={handleChange} />
                </div>
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="email" name="email" type="email" placeholder="coach@example.com" className="pl-10" value={formData.email} onChange={handleChange} />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="password" name="password" type={showPassword ? 'text' : 'password'} className="pl-10 pr-10" value={formData.password} onChange={handleChange} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i < strength.strength ? strength.color : 'bg-slate-100'}`} />
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500">Strength: <span className="font-bold">{strength.label}</span></p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} className="pl-10 pr-10" value={formData.confirmPassword} onChange={handleChange} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-[10px] text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" /> Passwords match</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-2">
                <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={setAcceptedTerms} />
                <Label htmlFor="terms" className="text-xs text-slate-500 leading-tight cursor-pointer">
                  I agree to the <span className="text-emerald-600 underline">Terms of Service</span> and <span className="text-emerald-600 underline">Privacy Policy</span>.
                </Label>
              </div>
              {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-11" disabled={isLoading}>
                {isLoading ? <><Loader className="w-4 h-4 mr-2 animate-spin" /> Creating Account...</> : 'Create Account'}
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Or</span></div>
              </div>

              <div className="w-full flex justify-center">
                <GoogleLogin onSuccess={handleGoogleSuccess} theme="outline" shape="pill" width="320" />
              </div>

              <p className="text-sm text-center text-slate-600">
                Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Log in</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;