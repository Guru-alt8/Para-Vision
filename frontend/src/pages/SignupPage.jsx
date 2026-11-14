import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Accessibility, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import heroImg from '../assets/hero.png';

const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = (pw) => {
    if (pw.length === 0) return null;
    if (pw.length < 6) return 'weak';
    if (pw.length < 10 || !/[0-9]/.test(pw)) return 'medium';
    return 'strong';
  };
  const strength = passwordStrength(form.password);
  const strengthColor = { weak: 'bg-red-400', medium: 'bg-yellow-400', strong: 'bg-accent' };
  const strengthWidth = { weak: 'w-1/3', medium: 'w-2/3', strong: 'w-full' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
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
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/40 to-transparent" />
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
              Empowerment <br />
              Starts with <span className="text-accent">Data.</span>
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Create an account to join thousands of citizens mapping accessibility and advocating for a barrier-free India.
            </p>
            <div className="space-y-4">
              {['Contribute Local Insights', 'Track Civic Progress', 'Advocate for Change'].map((text, i) => (
                <div key={i} className="flex items-center text-white/80 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-accent mr-3" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-20 relative overflow-y-auto">
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md my-10"
        >
          <div className="mb-10 text-center lg:text-left">
            <Link to="/" className="inline-flex lg:hidden items-center text-primary font-bold mb-8">
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </Link>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary shadow-lg shadow-primary/20 text-white mb-6">
              <Accessibility className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-muted mt-2 font-medium">Join the mission for an inclusive India.</p>
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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-accent transition-colors" />
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="input-field pl-12 pr-4 bg-white/80 border-gray-100 focus:bg-white"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Email address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-accent transition-colors" />
                  <input
                    id="signup-email"
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
                    id="signup-password"
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
                {strength && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-3 px-1"
                  >
                    <div className="h-1.5 w-full bg-gray-200/50 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${strengthColor[strength]} ${strengthWidth[strength]}`} />
                    </div>
                    <p className={`text-[10px] mt-1.5 font-black uppercase tracking-widest ${strength === 'strong' ? 'text-accent' : strength === 'medium' ? 'text-yellow-500' : 'text-red-400'}`}>
                      {strength} password
                    </p>
                  </motion.div>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-accent transition-colors" />
                  <input
                    id="signup-confirm"
                    type={showPw ? 'text' : 'password'}
                    required
                    value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                    className="input-field pl-12 pr-12 bg-white/80 border-gray-100 focus:bg-white"
                    placeholder="••••••••"
                  />
                  {form.confirm && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {form.password === form.confirm
                        ? <CheckCircle2 className="w-5 h-5 text-accent" />
                        : <AlertCircle className="w-5 h-5 text-red-300" />}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 text-base shadow-xl shadow-primary/10 disabled:opacity-50"
                >
                  {loading ? 'Generating Account...' : 'Create My Account'}
                </button>
              </div>
            </form>

            <div className="text-center mt-10">
              <p className="text-sm text-muted font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-black hover:text-accent transition-colors underline underline-offset-4 decoration-primary/20">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
