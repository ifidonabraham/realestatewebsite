'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Link from 'next/link';

export default function ResetRequestPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset link sent! Please check your email inbox.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-neutral-light/30">
      <Card className="w-full max-w-md p-10 md:p-14 rounded-[48px] shadow-2xl border-none">
        <div className="text-center space-y-3 mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-[32px] mx-auto mb-6 flex items-center justify-center text-3xl shadow-inner">
            🔐
          </div>
          <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tight leading-none">Reset Password</h1>
          <p className="text-neutral font-medium">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-500 text-sm font-bold rounded-2xl border border-red-100">⚠️ {error}</div>}
        {message && <div className="mb-6 p-4 bg-green-50 text-green-600 text-sm font-bold rounded-2xl border border-green-100">✅ {message}</div>}

        {!message && (
          <form onSubmit={handleReset} className="space-y-8">
            <Input 
              label="Email Address" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              required
            />
            
            <Button 
              type="submit" 
              className="w-full h-16 rounded-[24px] font-black text-lg shadow-xl shadow-primary/20"
              disabled={loading}
            >
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </Button>
          </form>
        )}

        <div className="mt-10 pt-8 border-t border-neutral/5 text-center">
          <Link href="/login" className="text-sm font-black text-primary uppercase tracking-widest hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}
