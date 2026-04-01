'use client';

import React from 'react';
import Link from 'next/link';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-black text-primary-dark tracking-tighter">
              RealEstate<span className="text-accent underline decoration-4 decoration-accent/20 underline-offset-4">Finder</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            <Link href="/properties" className="text-sm font-black uppercase tracking-widest text-neutral hover:text-primary transition-all">
              Listings
            </Link>
            <Link href="/dashboard" className="text-sm font-black uppercase tracking-widest text-neutral hover:text-primary transition-all">
              Dashboard
            </Link>
            <Link href="/contact" className="text-sm font-black uppercase tracking-widest text-neutral hover:text-primary transition-all">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-6">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-black text-primary-dark uppercase tracking-widest leading-none">Account</p>
                    <p className="text-[10px] text-neutral font-bold mt-1 line-clamp-1 max-w-[120px]">{user.email}</p>
                  </div>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="text-red-500 hover:bg-red-50 font-black rounded-xl"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="font-black rounded-xl">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-xl px-8 shadow-xl shadow-primary/20 font-black">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
