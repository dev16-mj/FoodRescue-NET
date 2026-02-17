
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
            {view === 'login' ?