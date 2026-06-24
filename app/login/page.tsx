'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithEmail, loginWithGoogle, registerWithEmail } from '@/lib/auth';
import { useAuth } from '@/lib/AuthContext';
import { useEffect } from 'react';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, role } = useAuth();

  useEffect(() => {
    if (user && role === 'admin') router.push('/admin');
    else if (user && role === 'user') router.push('/dashboard');
  }, [user, role, router]);

  const handleEmailAuth = async () => {
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (isRegister && !name) { setError('Please enter your name.'); return; }
    setLoading(true);
    try {
      if (isRegister) {
        await registerWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      if (message.includes('email-already-in-use')) setError('Email already registered. Please login.');
      else if (message.includes('wrong-password') || message.includes('invalid-credential')) setError('Incorrect email or password.');
      else if (message.includes('weak-password')) setError('Password must be at least 6 characters.');
      else setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch {
      setError('Google sign-in failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-[#1E3A8A] text-white font-bold text-sm px-2 py-1 rounded">DLTC</div>
            <span className="font-bold text-lg text-[#1E3A8A]">Rossburgh Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1E3A8A]">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {isRegister ? 'Sign up to manage your bookings' : 'Login to your account'}
          </p>
        </div>

        {/* Google Button */}
        <button onClick={handleGoogle} disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition mb-4">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200"/>
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200"/>
        </div>

        {/* Form */}
        <div className="space-y-3">
          {isRegister && (
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Full name"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]" />
          )}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            onKeyDown={e => e.key === 'Enter' && handleEmailAuth()}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1E3A8A]" />
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <button onClick={handleEmailAuth} disabled={loading}
          className="w-full bg-[#1E3A8A] text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition mt-4 disabled:opacity-50">
          {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-[#1E3A8A] font-semibold ml-1 hover:underline">
            {isRegister ? 'Login' : 'Sign up'}
          </button>
        </p>

      </div>
    </main>
  );
}