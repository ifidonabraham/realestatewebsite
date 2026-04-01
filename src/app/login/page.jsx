'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setError(null);
    const { error } = await signIn(data);
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-neutral-light/30">
      <Card className="w-full max-w-md p-8 md:p-12 rounded-[48px] shadow-2xl border-none">
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tight">Welcome Back</h1>
          <p className="text-neutral font-medium">Log in to manage your properties and inquiries.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 text-sm font-bold rounded-2xl border border-red-100">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input 
            label="Email Address" 
            type="email" 
            {...register('email')} 
            error={errors.email?.message}
            placeholder="name@example.com"
          />
          <Input 
            label="Password" 
            type="password" 
            {...register('password')} 
            error={errors.password?.message}
            placeholder="••••••••"
          />
          
          <div className="flex justify-end">
            <Link href="/reset" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
              Forgot Password?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t border-neutral/5 text-center">
          <p className="text-sm text-neutral font-medium">
            Don't have an account? <Link href="/register" className="text-primary font-black hover:underline">Create Account</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
