
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole, name: string, email: string) => void;
  onSignup: (name: string, email: string, password: string, role: UserRole) => void;
}

type AuthView = 'login' | 'signup' | 'forgotPassword';

const Login: React.FC<LoginProps> = ({ onLogin, onSignup }) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.DONOR);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }
    
    if (view === 'login') {
      onLogin(role, name || (email.split('@')[0]), email);
    } else if (view === 'signup') {
      onSignup(name, email, password, role);
    } else if (view === 'forgotPassword') {
      alert(`A password reset link has been sent to ${email}. Please check your inbox.`);
      setView('login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6 font-sans">
      <div className="w-full max-w-[440px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-12">
        <div className="flex flex-col items-center mb-12">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-100 mb-6">
            <i className="fa-regular fa-heart text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">FoodRescueNet</h1>
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest mt-3">
            {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Create Account' : 'Reset Access'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {view === 'signup' && (
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-medium"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
              <input 
                type="email" 
                required
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-medium"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {view !== 'forgotPassword' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
                {view === 'login' && (
                  <button 
                    type="button"
                    onClick={() => setView('forgotPassword')}
                    className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider hover:text-emerald-700"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <i className="fa-regular fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-medium"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          {view === 'signup' && (
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: UserRole.DONOR, label: 'Donor', icon: 'fa-hand-holding-heart' },
                  { id: UserRole.NGO, label: 'NGO', icon: 'fa-building-ngo' },
                  { id: UserRole.DELIVERY, label: 'Delivery', icon: 'fa-truck' },
                  { id: UserRole.RECIPIENT, label: 'Recipient', icon: 'fa-user-group' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all text-xs font-bold ${
                      role === r.id 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                    }`}
                  >
                    <i className={`fa-solid ${r.icon} text-[10px]`}></i>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-gray-100 hover:shadow-emerald-100 mt-4"
          >
            {view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-xs font-medium text-gray-400">
            {view === 'login' ? (
              <>
                Don't have an account?{' '}
                <button 
                  onClick={() => setView('signup')}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button 
                  onClick={() => setView('login')}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
