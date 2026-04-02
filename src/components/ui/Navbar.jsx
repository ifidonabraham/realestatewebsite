'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import { Menu, X, Home, LayoutDashboard, MessageCircle, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const navLinks = [
    { label: 'Marketplace', href: '/properties', icon: Home },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Contact', href: '/contact', icon: MessageCircle },
  ];

  return (
    <>
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-[100] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-black text-primary-dark tracking-tighter">
                Omega<span className="text-accent underline decoration-4 decoration-accent/20 underline-offset-4">Estate</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={cn(
                    "text-sm font-black uppercase tracking-widest transition-all hover:text-primary",
                    pathname === link.href ? "text-primary" : "text-neutral"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions / Auth */}
            <div className="hidden md:flex items-center gap-4">
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

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center gap-4">
              {!user && (
                <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Login
                </Link>
              )}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-primary-dark focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={cn(
        "fixed inset-0 z-[90] bg-white transition-transform duration-500 md:hidden pt-20",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-6 space-y-10">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-neutral uppercase tracking-[0.3em] pl-2">Navigation</p>
            <div className="grid grid-cols-1 gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-[24px] font-black text-lg transition-all",
                    pathname === link.href ? "bg-primary text-white shadow-xl shadow-primary/20" : "bg-neutral-light text-primary-dark active:scale-95"
                  )}
                >
                  <link.icon size={24} />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-neutral uppercase tracking-[0.3em] pl-2">Account</p>
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-5 bg-neutral-light rounded-[24px]">
                  <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-primary-dark font-black truncate max-w-[200px]">{user.user_metadata?.full_name || 'Verified User'}</p>
                    <p className="text-xs text-neutral font-bold">{user.email}</p>
                  </div>
                </div>
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full h-16 rounded-[24px] border-2 text-red-500 border-red-100 font-black flex gap-3"
                >
                  <LogOut size={20} /> Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/register" className="w-full">
                  <Button className="w-full h-16 rounded-[24px] font-black text-lg shadow-xl shadow-primary/20">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full h-16 rounded-[24px] border-2 font-black text-lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
