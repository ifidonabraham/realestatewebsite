'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Button from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../components/ui/Card';
import { Input, Textarea } from '../../../components/ui/Input';
import { useProperties } from '../../../context/PropertyContext';
import { cn } from '../../../lib/utils';
import { supabase } from '../../../lib/supabase';
import MessageAgentModal from '../../../components/messaging/MessageAgentModal';
import BookingCalendar from '../../../components/properties/BookingCalendar';
import ImageGallery from '../../../components/properties/ImageGallery';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Heart, ChevronLeft, BadgeCheck } from 'lucide-react';

export default function PropertyDetailPage() {
  const params = useParams();
  const { properties, toggleFavorite, isFavorite, loading } = useProperties();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  
  const property = properties.find(p => String(p.id) === String(params.id));

  useEffect(() => {
    if (property && property.id && !property.isMock) {
      supabase.rpc('increment_views', { target_id: property.id })
        .then(({ error }) => {
          if (error) {
            supabase
              .from('properties')
              .update({ views_count: (property.views_count || 0) + 1 })
              .eq('id', property.id);
          }
        });
    }
  }, [property?.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <Skeleton className="h-[500px] w-full rounded-[40px]" />
            <div className="space-y-4">
               <Skeleton className="h-12 w-3/4" />
               <Skeleton className="h-6 w-1/2" />
            </div>
            <div className="h-32 w-full rounded-[40px] bg-neutral-light/30 grid grid-cols-4 gap-4 p-8">
               {[1,2,3,4].map(i => <Skeleton key={i} className="h-full w-full" />)}
            </div>
          </div>
          <aside>
            <Skeleton className="h-[600px] w-full rounded-[48px]" />
          </aside>
        </div>
      </div>
    );
  }

  if (!property) return (
    <div className="p-20 text-center space-y-6">
      <div className="text-7xl">🔍</div>
      <h2 className="text-3xl font-black text-primary-dark">Property Not Found</h2>
      <Link href="/properties">
        <Button className="rounded-2xl font-black px-10">Return to Marketplace</Button>
      </Link>
    </div>
  );

  const favorited = isFavorite(property.id);

  const getSpecs = () => {
    const common = [{ label: 'Type', val: property.type, icon: '🏠' }];
    if (property.category === 'Residential' || property.category === 'Shortlet') {
      return [
        ...common,
        { label: 'Bedrooms', val: property.beds, icon: '🛏️' },
        { label: 'Bathrooms', val: property.baths, icon: '🚿' },
        { label: 'Square Ft', val: property.sqft || 'N/A', icon: '📐' }
      ];
    } else if (property.category === 'Land') {
      return [
        ...common,
        { label: 'Total Area', val: (property.sqft || 'N/A') + ' sqm', icon: '📐' },
        { label: 'Status', val: property.status, icon: '🏷️' }
      ];
    } else if (property.category === 'Commercial') {
      return [
        ...common,
        { label: 'Total Area', val: (property.sqft || 'N/A') + ' sqft', icon: '🏢' },
        { label: 'Bathrooms', val: property.baths || 'N/A', icon: '🚿' }
      ];
    }
    return common;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation Header */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/properties" className="text-sm font-bold text-neutral hover:text-primary transition-colors flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Back to Results
        </Link>
        <div className="flex items-center gap-4">
          {property.isMock && (
            <span className="px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg bg-amber-500">
              Sample Listing
            </span>
          )}
          <button 
            onClick={() => toggleFavorite(property.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all border-2 shadow-lg focus:outline-none focus:ring-4 focus:ring-red-200",
              favorited ? "bg-red-500 border-red-500 text-white shadow-red-200" : "bg-white border-neutral/10 text-neutral hover:border-red-500 hover:text-red-500"
            )}
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn("w-5 h-5", favorited && "fill-current")} />
            {favorited ? 'Saved' : 'Save Property'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Gallery & Description */}
        <div className="lg:col-span-2 space-y-10">
          <ImageGallery mainImage={property.image} gallery={property.gallery} />

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl md:text-5xl font-black text-primary-dark tracking-tight leading-none">
                    {property.title}
                  </h1>
                  {property.is_verified && (
                    <BadgeCheck className="w-10 h-10 text-blue-500 shrink-0" aria-label="Verified Listing" />
                  )}
                </div>
                <p className="text-xl text-neutral font-medium">📍 {property.location}</p>
              </div>
              <p className="text-4xl font-black text-primary">{property.formattedPrice}</p>
            </div>
          </div>

          <div className="p-10 bg-neutral-light/50 rounded-[40px] grid grid-cols-2 md:grid-cols-4 gap-8 border border-neutral/5">
            {getSpecs().map((spec, i) => (
              <div key={i} className="text-center space-y-1">
                <span className="text-3xl block mb-2" aria-hidden="true">{spec.icon}</span>
                <p className="text-lg font-black text-primary-dark">{spec.val}</p>
                <p className="text-[10px] text-neutral uppercase font-black tracking-[0.2em]">{spec.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black text-primary-dark uppercase tracking-widest">About this Property</h2>
            <p className="text-neutral text-lg leading-relaxed font-medium">{property.description}</p>
          </div>
        </div>

        {/* Agent/Contact Sidebar */}
        <aside className="space-y-8">
          <div className="sticky top-24 space-y-8">
            
            {/* Conditional Booking Calendar */}
            {property.category === 'Shortlet' && (
              <BookingCalendar property={property} />
            )}

            <Card className="border-neutral/10 shadow-2xl rounded-[48px] overflow-hidden">
              <div className="bg-primary p-10 text-center text-white relative">
                <div className="absolute inset-0 bg-primary-dark opacity-10 pointer-events-none"></div>
                <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-[32px] mx-auto mb-6 flex items-center justify-center text-white font-black text-4xl shadow-2xl border border-white/10">
                  {property.agent.name?.charAt(0)}
                </div>
                <CardTitle className="text-2xl font-black">{property.agent.name}</CardTitle>
                <p className="text-xs font-black text-white/60 uppercase tracking-[0.3em] mt-2">Authorized Agent</p>
              </div>
              <CardContent className="p-10 space-y-8 bg-white">
                 <div className="space-y-4">
                    <p className="text-sm text-neutral font-medium text-center px-4">Interested in this property? Send a direct message to the agent to schedule a viewing or request more info.</p>
                    <Button 
                      onClick={() => setIsMessageModalOpen(true)}
                      className="w-full h-16 rounded-[24px] font-black text-lg shadow-2xl shadow-primary/20 focus:ring-4 focus:ring-primary/10"
                    >
                      Send Inquiry
                    </Button>
                 </div>
                 
                 <div className="pt-6 border-t border-neutral/5 text-center">
                    <p className="text-[10px] font-black text-neutral uppercase tracking-widest mb-4">Or Contact Directly</p>
                    <p className="text-lg font-black text-primary-dark">{property.agent.phone}</p>
                 </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>

      <MessageAgentModal 
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        property={property}
      />
    </div>
  );
}
