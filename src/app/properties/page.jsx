'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import { useProperties } from '../../context/PropertyContext';
import { cn } from '../../lib/utils';
import { Heart, Search, SlidersHorizontal } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

// ... (keep the dynamic import for PropertyMap)

export default function PropertiesPage() {
  const { filteredProperties, filters, setFilters, toggleFavorite, isFavorite, loading } = useProperties();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' or 'map'

  const updateFilter = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-primary-dark tracking-tighter">Marketplace</h1>
          <p className="text-neutral font-bold mt-1 uppercase tracking-widest text-xs">
            {loading ? <Skeleton className="h-4 w-32 inline-block" /> : `Nigeria · ${filteredProperties.length} Results Available`}
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* View Toggle */}
          <div className="flex p-1.5 bg-neutral-light rounded-2xl border border-neutral/5 shadow-inner" role="tablist" aria-label="View Toggle">
            <button 
              role="tab"
              aria-selected={view === 'grid'}
              onClick={() => setView('grid')}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-primary",
                view === 'grid' ? "bg-white shadow-lg text-primary" : "text-neutral hover:text-primary"
              )}
            >
              Grid
            </button>
            <button 
              role="tab"
              aria-selected={view === 'map'}
              onClick={() => setView('map')}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-primary",
                view === 'map' ? "bg-white shadow-lg text-primary" : "text-neutral hover:text-primary"
              )}
            >
              Map
            </button>
          </div>

          <Button 
            variant="outline" 
            className="md:hidden flex-1 flex items-center justify-center gap-2 rounded-xl font-black border-2 h-12"
            onClick={() => setIsFilterModalOpen(true)}
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Sidebar Filters */}
        <aside className="hidden md:block w-80 shrink-0">
          <div className="sticky top-24 p-10 border border-neutral/10 rounded-[48px] bg-white shadow-2xl space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-primary-dark tracking-tight">Refine</h2>
              <button 
                onClick={() => setFilters({
                  location: '', type: 'Any Type', status: 'Any', minPrice: '', maxPrice: '', beds: '', baths: ''
                })}
                className="text-[10px] font-black text-accent hover:underline uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-accent rounded px-1"
              >
                Reset
              </button>
            </div>
            
            <FilterContent filters={filters} updateFilter={updateFilter} />
            
            <Button className="w-full h-16 rounded-[24px] font-black text-lg shadow-xl shadow-primary/20">
              Apply Filter
            </Button>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 min-h-[600px]">
          {view === 'map' ? (
            <PropertyMap properties={filteredProperties} />
          ) : loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2, 4, 5].map((i) => (
                <div key={i} className="rounded-[40px] overflow-hidden bg-white shadow-sm h-[500px] flex flex-col">
                  <Skeleton className="w-full h-64" />
                  <div className="p-8 space-y-4 flex-1">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-1/3 mt-4" />
                    <div className="flex gap-4 mt-auto">
                      <Skeleton className="h-14 flex-1 rounded-2xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredProperties.map((prop) => (
                <Card key={prop.id} className="group hover:shadow-2xl transition-all duration-700 border-neutral/10 flex flex-col overflow-hidden h-full rounded-[40px] bg-white border-none shadow-sm" as="article">
                  <div className="w-full h-64 bg-neutral-light relative overflow-hidden shrink-0">
                    <img 
                      src={prop.image} 
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
                      <span className="px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-2xl bg-primary">
                        {prop.status}
                      </span>
                      {prop.isMock && (
                        <span className="px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-2xl bg-amber-500">
                          Sample Listing
                        </span>
                      )}
                    </div>
                    {/* Heart Button */}
                    <button 
                      onClick={() => toggleFavorite(prop.id)}
                      className={cn(
                        "absolute top-5 right-5 z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg backdrop-blur-md focus:outline-none focus:ring-4 focus:ring-primary/20",
                        isFavorite(prop.id) ? "bg-red-500 text-white" : "bg-white/80 text-primary hover:bg-white"
                      )}
                      aria-label={isFavorite(prop.id) ? `Remove ${prop.title} from favorites` : `Add ${prop.title} to favorites`}
                    >
                      <Heart className={cn("w-6 h-6", isFavorite(prop.id) && "fill-current")} />
                    </button>
                  </div>

                  <div className="flex flex-col flex-1 p-8">
                    <div className="flex-1 space-y-2">
                      <CardTitle className="text-2xl font-black text-primary-dark group-hover:text-primary transition-colors line-clamp-1 leading-tight">{prop.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm font-bold opacity-70">
                        📍 {prop.location}
                      </CardDescription>
                      <p className="text-3xl font-black text-primary py-4">{prop.formattedPrice}</p>
                      <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral/60">
                        <span className="flex items-center gap-2">🛏️ {prop.beds || 0}</span>
                        <span className="flex items-center gap-2">🚿 {prop.baths || 0}</span>
                        <span className="flex items-center gap-2">🏠 {prop.type}</span>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-10">
                      <Link href={`/properties/${prop.id}`} className="flex-1">
                        <Button variant="outline" className="w-full font-black rounded-2xl h-14 border-2 focus:ring-4 focus:ring-primary/10">Details</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-neutral-light rounded-[48px] space-y-6 shadow-inner animate-in fade-in zoom-in duration-500">
              <div className="text-7xl">🏚️</div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-primary-dark">No Listings Match</h3>
                <p className="text-neutral font-medium text-lg">Try widening your search radius or price range.</p>
              </div>
              <Button 
                variant="outline" 
                className="font-black border-2 rounded-2xl px-10 h-14"
                onClick={() => setFilters({
                  location: '', type: 'Any Type', status: 'Any', minPrice: '', maxPrice: '', beds: '', baths: ''
                })}
              >
                Clear Search
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Modal */}
      <Modal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
        title="Refine Search"
        className="max-w-md rounded-[48px]"
      >
        <div className="space-y-8">
          <FilterContent filters={filters} updateFilter={updateFilter} />
          <Button className="w-full h-16 rounded-[24px] font-black text-lg" onClick={() => setIsFilterModalOpen(false)}>
            View {filteredProperties.length} Results
          </Button>
        </div>
      </Modal>

    </div>
  );
}

function FilterContent({ filters, updateFilter }) {
  return (
    <div className="space-y-8">
      <Input 
        label="Location" 
        placeholder="Lekki, VI, Maitama..." 
        value={filters.location}
        onChange={(e) => updateFilter('location', e.target.value)}
      />
      
      <div className="space-y-3">
        <label className="text-xs font-black text-primary-dark uppercase tracking-widest">Listing For</label>
        <div className="flex gap-2 p-1.5 bg-neutral-light rounded-[20px] border border-neutral/5">
          {['Any', 'For Sale', 'For Rent'].map((s) => (
            <button 
              key={s}
              onClick={() => updateFilter('status', s)}
              className={cn(
                "flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest",
                filters.status === s ? "bg-white shadow-lg text-primary" : "text-neutral hover:text-primary"
              )}
            >
              {s.split(' ').pop()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-black text-primary-dark uppercase tracking-widest">Category</label>
        <select 
          value={filters.type}
          onChange={(e) => updateFilter('type', e.target.value)}
          className="flex h-14 w-full rounded-[24px] border-2 border-neutral/10 bg-white px-6 py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer"
        >
          <option>Any Type</option>
          <option value="House">Houses</option>
          <option value="Apartment">Apartments</option>
          <option value="Land">Land / Plots</option>
          <option value="Office">Commercial</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Input 
          label="Min (₦)" 
          type="number" 
          value={filters.minPrice}
          onChange={(e) => updateFilter('minPrice', e.target.value)}
        />
        <Input 
          label="Max (₦)" 
          type="number" 
          value={filters.maxPrice}
          onChange={(e) => updateFilter('maxPrice', e.target.value)}
        />
      </div>
    </div>
  );
}
