'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { useProperties } from '../context/PropertyContext';
import { cn } from '../lib/utils';
import { Heart, Search, MapPin, Home } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';

export default function HomePage() {
  const { properties, setFilters, toggleFavorite, isFavorite, loading } = useProperties();
  const router = useRouter();
  
  const [localSearch, setLocalSearch] = useState({
    location: '',
    type: 'Any Type'
  });

  const featuredProperties = properties.slice(0, 3);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setFilters(prev => ({
      ...prev,
      location: localSearch.location,
      type: localSearch.type
    }));
    router.push('/properties');
  };

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center justify-center bg-primary-dark text-white text-center px-4 overflow-hidden" aria-labelledby="hero-title">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30 scale-105"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <span className="bg-accent/20 text-accent px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase">Premium Real Estate</span>
            <h1 id="hero-title" className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              Find Your Next <br /> <span className="text-accent">Dream Home</span>
            </h1>
          </div>
          <p className="text-xl text-neutral-light opacity-90 max-w-2xl mx-auto font-medium">
            The most seamless way to discover, view, and secure properties from verified agents across Nigeria.
          </p>

          <form onSubmit={handleSearch} className="bg-white p-2 md:p-3 rounded-[32px] shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto items-center border border-white/20">
            <div className="flex-1 w-full px-4 flex items-center gap-3">
              <label htmlFor="hero-location" className="sr-only">Location</label>
              <MapPin className="text-primary w-5 h-5 shrink-0" aria-hidden="true" />
              <input 
                id="hero-location"
                type="text" 
                placeholder="Where are you looking? (e.g. Lekki)" 
                className="w-full h-12 text-neutral-dark focus:outline-none placeholder:text-neutral/50 font-medium"
                value={localSearch.location}
                onChange={(e) => setLocalSearch(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="h-8 w-[1px] bg-neutral/10 hidden md:block"></div>
            <div className="w-full md:w-48 px-4 flex items-center gap-3">
              <label htmlFor="hero-type" className="sr-only">Property Type</label>
              <Home className="text-primary w-5 h-5 shrink-0" aria-hidden="true" />
              <select 
                id="hero-type"
                className="w-full h-12 text-neutral-dark focus:outline-none font-medium bg-transparent cursor-pointer appearance-none"
                value={localSearch.type}
                onChange={(e) => setLocalSearch(prev => ({ ...prev, type: e.target.value }))}
              >
                <option>Any Type</option>
                <option>House</option>
                <option>Apartment</option>
                <option>Land</option>
              </select>
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto h-14 px-10 rounded-[24px] text-lg font-bold shadow-lg shadow-primary/20">
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-12 relative z-20" aria-label="Browse by category">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Houses', icon: '🏠', type: 'House' },
            { label: 'Apartments', icon: '🏢', type: 'Apartment' },
            { label: 'Shortlets', icon: '🛌', type: 'Shortlet' },
            { label: 'Land', icon: '🌱', type: 'Land' },
          ].map((cat) => (
            <button
              key={cat.label}
              onClick={() => {
                setFilters(prev => ({ ...prev, type: cat.type }));
                router.push('/properties');
              }}
              className="bg-white p-6 md:p-10 rounded-[32px] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group border border-neutral/5 text-center space-y-4 focus:outline-none focus:ring-4 focus:ring-primary/10"
              aria-label={`Browse ${cat.label}`}
            >
              <div className="w-16 h-16 bg-neutral-light rounded-[24px] flex items-center justify-center mx-auto text-3xl group-hover:bg-primary group-hover:text-white transition-colors" aria-hidden="true">
                {cat.icon}
              </div>
              <h3 className="font-black text-primary-dark uppercase tracking-widest text-xs md:text-sm">{cat.label}</h3>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10" aria-labelledby="featured-title">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 id="featured-title" className="text-4xl font-black text-primary-dark">Featured Properties</h2>
            <p className="text-neutral text-lg mt-2">Handpicked luxury listings in prime locations.</p>
          </div>
          <Link href="/properties">
            <Button variant="outline" className="rounded-xl font-bold border-2 focus:ring-4 focus:ring-primary/10">Explore All Listings</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="rounded-[32px] overflow-hidden bg-white shadow-sm h-[450px] flex flex-col">
                <Skeleton className="w-full h-64" />
                <div className="p-6 space-y-4 flex-1">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-1/3 mt-4" />
                </div>
              </div>
            ))
          ) : featuredProperties.map((prop) => (
            <Card key={prop.id} className="group hover:shadow-2xl transition-all duration-500 border-neutral/10 rounded-[32px] overflow-hidden flex flex-col h-full bg-white" as="article">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={prop.image} 
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <span className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg",
                    prop.status === 'For Sale' ? 'bg-primary' : 'bg-accent'
                  )}>
                    {prop.status}
                  </span>
                  {prop.isMock && (
                    <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg bg-amber-500">
                      Sample
                    </span>
                  )}
                </div>
                {/* Heart Button */}
                <button 
                  onClick={() => toggleFavorite(prop.id)}
                  className={cn(
                    "absolute top-4 right-4 z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg backdrop-blur-md focus:outline-none focus:ring-4 focus:ring-primary/20",
                    isFavorite(prop.id) ? "bg-red-500 text-white" : "bg-white/80 text-primary hover:bg-white"
                  )}
                  aria-label={isFavorite(prop.id) ? `Remove ${prop.title} from favorites` : `Add ${prop.title} to favorites`}
                >
                  <Heart className={cn("w-5 h-5", isFavorite(prop.id) && "fill-current")} aria-hidden="true" />
                </button>
              </div>
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1 font-bold">{prop.title}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 font-medium">
                  📍 {prop.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 py-2 flex-1">
                <p className="text-3xl font-black text-primary">{prop.formattedPrice}</p>
                <div className="flex gap-4 mt-4 text-sm text-neutral font-bold uppercase tracking-wider">
                  <span>🛏️ {prop.beds || 0} Beds</span>
                  <span>🚿 {prop.baths || 0} Baths</span>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-2">
                <Link href={`/properties/${prop.id}`} className="w-full">
                  <Button className="w-full h-12 rounded-2xl font-bold shadow-md shadow-primary/10 focus:ring-4 focus:ring-primary/10">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-dark py-20 text-white" aria-label="Platform Statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Properties', val: '2,500+' },
              { label: 'Happy Clients', val: '1,200+' },
              { label: 'Verified Agents', val: '450+' },
              { label: 'Cities', val: '12' }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="text-4xl md:text-5xl font-black text-accent">{stat.val}</p>
                <p className="text-neutral-light/60 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-16" aria-labelledby="how-it-works-title">
        <div className="text-center space-y-4">
          <h2 id="how-it-works-title" className="text-4xl font-black text-primary-dark">How It Works</h2>
          <p className="text-neutral text-lg max-w-2xl mx-auto">Your journey to a new home made simple and transparent.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { title: 'Smart Search', desc: 'Use our advanced filters to find exactly what you need.', icon: '🔍' },
            { title: 'Direct Contact', desc: 'Message verified agents directly through our platform.', icon: '✉️' },
            { title: 'Safe Deals', desc: 'Follow our safety guides for a secure property transaction.', icon: '🛡️' }
          ].map((step, i) => (
            <div key={i} className="text-center space-y-6 relative">
              <div className="w-24 h-24 bg-neutral-light rounded-[32px] flex items-center justify-center mx-auto text-4xl shadow-inner group hover:bg-primary transition-all duration-500">
                <span className="group-hover:scale-125 transition-transform duration-500" aria-hidden="true">{step.icon}</span>
              </div>
              <h3 className="text-2xl font-bold">{step.title}</h3>
              <p className="text-neutral leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
