
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole, name: string, email: string) => void;
  onSignup: (name: string, email: string, password: string, role: UserRole) => void;
}

type AuthView = 'login' | 'signup' | 'forgotPassword';

const Login: React.FC<LoginProps> = ({ onLogin, onSignup }) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('donor@foodrescue.net');
  const [password, setPassword] = useState('password');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.DONOR);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            {view === 'login' ? 'Network Authentication' : view === 'signup' ? 'Create Partner Account' : 'Account Recovery'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {view === 'signup' && (
            <>
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider px-1">Organization / Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-emerald-500 transition-all bg-gray-50/30 font-medium text-gray-700 text-sm"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider px-1">Account Role</label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-5 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-emerald-500 transition-all bg-gray-50/30 font-bold text-gray-700 text-sm appearance-none"
                  >
                    {Object.values(UserRole).map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none text-xs"></i>
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider px-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-emerald-500 transition-all bg-gray-50/30 font-medium text-gray-700 text-sm"
              placeholder="name@organization.org"
              required
            />
          </div>

          {view !== 'forgotPassword' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">Password</label>
                {view === 'login' && (
                  <button 
                    type="button"
                    onClick={() => setView('forgotPassword')}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-gray-100 focus:outline-none focus:border-emerald-500 transition-all bg-gray-50/30 font-medium text-gray-700 text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-50 transition-all text-sm tracking-wide"
          >
            {view === 'login' ? 'Sign In to Portal' : view === 'signup' ? 'Register Account' : 'Request Access Link'}
          </button>
        </form>

        <div className="mt-12 text-center pt-8 border-t border-gray-50">
          <p className="text-gray-400 text-[13px] font-medium">
            {view === 'login' ? (
              <>
                New to the platform?{' '}
                <button 
                  onClick={() => setView('signup')}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Create partner account
                </button>
              </>
            ) : (
              <button 
                onClick={() => setView('login')}
                className="text-gray-500 font-bold hover:text-emerald-600 flex items-center justify-center gap-2 mx-auto"
              >
                <i className="fa-solid fa-arrow-left text-[10px]"></i> Return to sign in
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
