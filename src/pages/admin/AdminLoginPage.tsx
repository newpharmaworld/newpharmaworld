import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, Loader2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { sendResetPassword } from '../../firebase/auth';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { login, loginGoogle } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      success('Welcome back, Administrator!');
      navigate('/admin');
    } catch (err: any) {
      console.error('Login failed:', err);
      let errorMsg = 'Failed to sign in. Please verify your email and password.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMsg = 'Invalid email or password. Please verify your credentials in Firebase Console.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'Access temporarily locked due to multiple failed attempts. Try again in a few minutes.';
      }
      error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginGoogle();
      success('Logged in with Google successfully!');
      navigate('/admin');
    } catch (err: any) {
      console.error('Google login failed:', err);
      error(err.message || 'Google sign-in failed or was cancelled.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      error('Please enter your admin email address to receive the password reset link.');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendResetPassword(email.trim());
      setResetSent(true);
      success('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
      console.error('Password reset failed:', err);
      error(err.message || 'Failed to send password reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-navy-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center text-white mx-auto shadow-lg">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            NEW PHARMA <span className="text-teal-400">WORLD</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Administrative Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-navy-900/90 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl border border-navy-800 shadow-2xl space-y-6 text-slate-200">
          {isResetMode ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Reset Admin Password</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your registered administrator email address to receive password reset instructions.
                </p>
              </div>

              {resetSent ? (
                <div className="p-4 bg-teal-900/40 border border-teal-500/40 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
                  <p className="text-xs text-teal-200 leading-relaxed">
                    A password reset link has been dispatched to <strong>{email}</strong>. Check your inbox.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(false);
                      setResetSent(false);
                    }}
                    className="text-xs text-teal-400 hover:underline font-semibold"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Admin Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@newpharmaworld.com"
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-navy-950 border border-navy-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setIsResetMode(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@newpharmaworld.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-navy-950 border border-navy-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-[11px] text-teal-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-navy-950 border border-navy-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In with Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-navy-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-navy-900 px-2 text-slate-500">Or continue with</span>
                </div>
              </div>

              {/* Google Sign-in Option */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl font-medium text-slate-200 bg-navy-950 hover:bg-navy-800 border border-navy-700 transition-all text-xs flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Sign In with Google</span>
              </button>
            </form>
          )}

          <div className="pt-2 text-center">
            <Link to="/" className="text-xs text-slate-500 hover:text-teal-400 transition-colors">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
