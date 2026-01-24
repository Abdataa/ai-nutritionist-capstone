import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import api from '../services/api';

export function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    
    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', null, {
        params: { email }
      });
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950/20 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8 animate-slide-up">
            <div className="flex items-center justify-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate('landing')}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50 transition-transform hover:scale-105">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">AI Nutritionist</span>
            </div>
          </div>

          {/* Success Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 sm:p-8 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Check Your Email
              </h1>
              
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                We've sent password reset instructions to <strong>{email}</strong>. 
                Please check your inbox and follow the link to reset your password.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Didn't receive the email? Check your spam folder or 
                  <button 
                    onClick={() => {
                      setIsSubmitted(false);
                      setError('');
                    }}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline"
                  >
                    try again
                  </button>
                </p>
              </div>
              
              <Button
                onClick={() => onNavigate('login')}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-11"
              >
                Back to Login
              </Button>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950/20 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8 animate-slide-up">
          <div className="flex items-center justify-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate('landing')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50 transition-transform hover:scale-105">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">AI Nutritionist</span>
          </div>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 sm:p-8 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => onNavigate('login')}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Reset Password</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className={`pl-10 h-11 transition-all ${error ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-emerald-500'}`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 flex items-center gap-1 animate-slide-up">
                  {error}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-11 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50 hover:shadow-xl hover:shadow-emerald-200/60 dark:hover:shadow-emerald-900/60 transition-all hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => onNavigate('login')}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors hover:underline"
            >
              Back to Login
            </button>
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