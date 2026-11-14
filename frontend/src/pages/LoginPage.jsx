import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Accessibility, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import heroImg from '../assets/hero.png';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      login(data.token, data.user);
      navigate('/');
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-stretch overflow-hidden">
      {/* Left side: Graphic (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img src={heroImg} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/40 to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-lg">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/" className="inline-flex items-center text-accent font-bold mb-12 hover:translate-x-[-4px] transition-transform">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <h2 className="text-5xl font-black text-white mb-6 leading-tight text-shadow-lg">
              Making India <br />
              Accessible for <span className="text-accent">Everyone.</span>
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Log in to contribute reviews, report barriers, and track accessibility improvements in your city.
            </p>
            <div className="space-y-4">
              {['3k+ Regular Contributors', '12+ City-wide Metrics', 'Impactful Civic Engagement'].map((text, i) => (
                <div key={i} className="flex items-center text-white/80 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-accent mr-3" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-20 relative">
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <Link to="/" className="inline-flex lg:hidden items-center text-primary font-bold mb-8">
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </Link>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-lg shadow-primary/20 text-white mb-6">
              <Accessibility className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-muted mt-2 font-medium">Continue your journey towards an inclusive world.</p>
          </div>

          <div className="glass-panel p-8 sm:p-10 rounded-3xl border-white bg-white/40 shadow-premium">
            {error && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl px-4 py-3 mb-6"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Email address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-accent transition-colors" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="input-field pl-12 pr-4 bg-white/80 border-gray-100 focus:bg-white"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-accent transition-colors" />
                  <input
                    id="login-password"
                    type={showPw ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="input-field pl-12 pr-12 bg-white/80 border-gray-100 focus:bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-900 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-1">
                <label className="flex items-center text-muted hover:text-slate-900 cursor-pointer transition-colors">
                  <input type="checkbox" className="mr-2 rounded border-gray-300 text-accent focus:ring-accent" />
                  Remember me
                </label>
                <a href="#" className="text-primary hover:text-accent transition-colors">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-base shadow-xl shadow-primary/10 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : 'Sign in to Account'}
              </button>
            </form>

            <div className="text-center mt-10">
              <p className="text-sm text-muted font-medium">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary font-black hover:text-accent transition-colors underline underline-offset-4 decoration-primary/20">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Global Footer info */}
        <p className="absolute bottom-8 text-[10px] uppercase tracking-[0.2em] font-black text-slate-300">
          Para Vision — Building an Inclusive India
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
