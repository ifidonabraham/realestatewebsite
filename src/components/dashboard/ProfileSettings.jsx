'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Input } from '../ui/Input';
import Button from '../ui/Button';

export default function ProfileSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    phone: user?.user_metadata?.phone || '',
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const { error } = await supabase.auth.updateUser({
      data: { 
        full_name: formData.fullName,
        phone: formData.phone 
      }
    });

    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-10 border-2 border-neutral/5 rounded-[48px] bg-white shadow-2xl space-y-10">
        <header className="space-y-2">
          <h2 className="text-2xl font-black text-primary-dark uppercase tracking-widest">Public Profile</h2>
          <p className="text-sm text-neutral font-medium">This information will be displayed on your property listings.</p>
        </header>

        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Display Name" 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              placeholder="e.g. Sarah Miller"
            />
            <Input 
              label="Contact Phone" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="e.g. +234 800 000 0000"
            />
          </div>

          <Input 
            label="Email Address (Locked)" 
            value={user?.email} 
            disabled 
            className="bg-neutral-light/50 opacity-60"
          />

          <div className="pt-6 border-t border-neutral/5 flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full h-16 rounded-[24px] font-black text-lg shadow-xl shadow-primary/20"
              disabled={loading}
            >
              {loading ? 'Saving Changes...' : 'Update Profile'}
            </Button>
            {success && (
              <p className="text-center text-xs font-black text-green-600 uppercase tracking-[0.2em] animate-bounce">
                ✅ Profile Updated Successfully
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
