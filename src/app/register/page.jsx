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

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    setError(null);
    const { error } = await signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-12 rounded-[48px] text-center space-y-6 shadow-2xl border-none">
          <div className="w-20 h-20 bg-green-500 text-white rounded-[32px] flex items-center justify-center mx-auto text-3xl shadow-xl">
            📧
          </div>
          <h1 className="text-3xl font-black text-primary-dark">Verify Email</h1>
          <p className="text-neutral font-medium">We've sent a verification link to your email address. Please check your inbox to complete registration.</p>
          <Link href="/login" className="block pt-4">
            <Button variant="outline" className="w-full rounded-2xl font-bold border-2">Back to Login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-neutral-light/30">
      <Card className="w-full max-w-md p-8 md:p-12 rounded-[48px] shadow-2xl border-none">
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tight">Create Account</h1>
          <p className="text-neutral font-medium">Join Nigeria's most trusted real estate platform.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 text-sm font-bold rounded-2xl border border-red-100">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input 
            label="Full Name" 
            {...register('fullName')} 
            error={errors.fullName?.message}
            placeholder="e.g. John Doe"
          />
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
          <Input 
            label="Confirm Password" 
            type="password" 
            {...register('confirmPassword')} 
            error={errors.confirmPassword?.message}
            placeholder="••••••••"
          />

          <Button 
            type="submit" 
            className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Get Started'}
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t border-neutral/5 text-center">
          <p className="text-sm text-neutral font-medium">
            Already have an account? <Link href="/login" className="text-primary font-black hover:underline">Sign In</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
