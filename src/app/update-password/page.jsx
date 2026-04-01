'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
    } else {
      alert('Password updated successfully! Please log in with your new password.');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-neutral-light/30">
      <Card className="w-full max-w-md p-10 md:p-14 rounded-[48px] shadow-2xl border-none">
        <div className="text-center space-y-3 mb-10">
          <div className="w-20 h-20 bg-accent/10 rounded-[32px] mx-auto mb-6 flex items-center justify-center text-3xl shadow-inner">
            🆕
          </div>
          <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tight leading-none">New Password</h1>
          <p className="text-neutral font-medium">Create a strong, secure password for your account.</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-500 text-sm font-bold rounded-2xl border border-red-100">⚠️ {error}</div>}

        <form onSubmit={handleUpdate} className="space-y-8">
          <Input 
            label="Enter New Password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          
          <Button 
            type="submit" 
            className="w-full h-16 rounded-[24px] font-black text-lg shadow-xl shadow-accent/20 bg-accent hover:bg-accent/90"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
