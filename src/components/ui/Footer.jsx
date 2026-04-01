import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold">
              RealEstate<span className="text-accent">Finder</span>
            </Link>
            <p className="mt-4 text-neutral-light/70 max-w-xs">
              Connecting buyers, renters, and agents with a seamless and trust-based platform. Find your dream home today.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-neutral-light/70">
              <li><Link href="/properties" className="hover:text-white">All Listings</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-neutral-light/70">
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-neutral-light/50 text-sm">
          &copy; {new Date().getFullYear()} Real Estate Finder. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
