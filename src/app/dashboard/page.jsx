'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { useProperties } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import Modal from '../../components/ui/Modal';
import PropertyForm from '../../components/dashboard/PropertyForm';
import ProfileSettings from '../../components/dashboard/ProfileSettings';
import { supabase } from '../../lib/supabase';
import { Heart } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

export default function DashboardPage() {
  const { properties, toggleFavorite, isFavorite, loading } = useProperties();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('favorites');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [dbMessages, setDbMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingLoadingMessages] = useState(false);

  // Filters
  const myListings = properties.filter(p => p.agent_id === user?.id);
  const favoriteProperties = properties.filter(p => isFavorite(p.id));

  // Stats
  const totalViews = myListings.reduce((sum, p) => sum + (p.views_count || 0), 0);
  const unreadMessages = dbMessages.filter(m => !m.read).length;

  useEffect(() => {
    if ((activeTab === 'messages' || activeTab === 'analytics') && user) {
      fetchMessages();
    }
  }, [activeTab, user]);

  const fetchMessages = async () => {
    setIsLoadingLoadingMessages(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('agent_email', user.email)
      .order('created_at', { ascending: false });

    if (!error) setDbMessages(data);
    setIsLoadingLoadingMessages(false);
  };

  const handleMarkAsRead = async (id) => {
    const { error } = await supabase.from('messages').update({ read: true }).eq('id', id);
    if (!error) setDbMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Sidebar */}
        <aside className="w-full md:w-72 space-y-2">
          <section className="p-8 bg-neutral-light rounded-[40px] mb-6 text-center shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12" />
            <div className="w-24 h-24 bg-primary text-white rounded-[32px] mx-auto mb-4 flex items-center justify-center text-4xl font-black shadow-2xl relative z-10">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-black text-primary-dark text-xl truncate relative z-10">{user?.user_metadata?.full_name || 'Agent Profile'}</h3>
            <p className="text-[10px] font-black text-neutral uppercase tracking-[0.25em] mt-2 relative z-10">Verified Partner</p>
          </section>

          <nav className="space-y-2" role="tablist" aria-label="Dashboard Tabs">
            {[
              { id: 'favorites', label: 'My Favorites', icon: '⭐', count: favoriteProperties.length },
              { id: 'listings', label: 'My Listings', icon: '🏠' },
              { id: 'messages', label: 'Messages', icon: '✉️', count: unreadMessages },
              { id: 'analytics', label: 'Analytics', icon: '📊' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full text-left px-6 py-4 rounded-2xl font-black transition-all flex items-center gap-4 relative focus:outline-none focus:ring-4 focus:ring-primary/20",
                  activeTab === tab.id ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" : "hover:bg-neutral-light text-neutral-dark hover:translate-x-1"
                )}
              >
                <span className="text-xl" aria-hidden="true">{tab.icon}</span>
                <span className="flex-1">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={cn(
                    "px-2 py-0.5 rounded-lg text-[10px] font-black",
                    activeTab === tab.id ? "bg-white/20" : "bg-primary text-white"
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8 focus:outline-none" tabIndex="-1">
          <header className="flex justify-between items-center">
            <h1 className="text-4xl font-black text-primary-dark capitalize tracking-tight">{activeTab}</h1>
            {activeTab === 'listings' && (
              <Button onClick={() => { setEditingProperty(null); setIsModalOpen(true); }} className="rounded-2xl font-black px-8 h-12 shadow-xl focus:ring-4 focus:ring-primary/20">
                + New Listing
              </Button>
            )}
          </header>

          {activeTab === 'favorites' && (
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {loading ? (
                [1, 2].map(i => (
                  <div key={i} className="rounded-[40px] overflow-hidden bg-white shadow-sm h-[400px] flex flex-col">
                    <Skeleton className="w-full h-56" />
                    <div className="p-8 space-y-4">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-1/3 mt-4" />
                    </div>
                  </div>
                ))
              ) : favoriteProperties.length > 0 ? favoriteProperties.map(prop => (
                <Card key={prop.id} className="group hover:shadow-2xl transition-all duration-500 rounded-[40px] overflow-hidden flex flex-col bg-white border-none shadow-sm" as="article">
                  <div className="h-56 relative overflow-hidden">
                    <img src={prop.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={prop.title} />
                    <button 
                      onClick={() => toggleFavorite(prop.id)}
                      className="absolute top-5 right-5 z-10 w-12 h-12 rounded-2xl flex items-center justify-center bg-red-500 text-white shadow-xl shadow-red-200 transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-200"
                      aria-label={`Remove ${prop.title} from favorites`}
                    >
                      <Heart className="w-6 h-6 fill-current" />
                    </button>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex-1 space-y-2">
                      <CardTitle className="text-2xl font-black text-primary-dark line-clamp-1">{prop.title}</CardTitle>
                      <CardDescription className="font-bold">📍 {prop.location}</CardDescription>
                      <p className="text-3xl font-black text-primary py-4">{prop.formattedPrice}</p>
                    </div>
                    <CardFooter className="p-0 pt-6 border-t border-neutral/5 flex gap-4 mt-auto">
                      <Link href={`/properties/${prop.id}`} className="flex-1">
                        <Button variant="outline" className="w-full font-black rounded-2xl h-14 border-2 focus:ring-4 focus:ring-primary/10">View Property</Button>
                      </Link>
                    </CardFooter>
                  </div>
                </Card>
              )) : (
                <div className="col-span-full py-32 bg-neutral-light rounded-[48px] text-center space-y-6 shadow-inner">
                  <div className="text-7xl opacity-20" aria-hidden="true">💖</div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-primary-dark">No Favorites Yet</h3>
                    <p className="text-neutral font-medium text-lg px-4">Properties you save while browsing will appear here for quick access.</p>
                  </div>
                  <Link href="/properties">
                    <Button className="rounded-[24px] font-black px-10 h-14 text-lg shadow-xl shadow-primary/20">Explore Marketplace</Button>
                  </Link>
                </div>
              )}
            </section>
          )}

          {activeTab === 'listings' && (
            <div className="grid grid-cols-1 gap-6">
              {loading ? (
                [1, 2].map(i => (
                  <div key={i} className="flex items-center p-6 gap-8 rounded-[40px] bg-white border-none shadow-sm h-32">
                    <Skeleton className="w-24 h-24 rounded-[24px]" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-11 w-24 rounded-xl" />
                  </div>
                ))
              ) : myListings.length > 0 ? myListings.map(list => (
                <Card key={list.id} className="group border-neutral/10 flex items-center p-6 gap-8 rounded-[40px] bg-white hover:shadow-2xl transition-all duration-500" as="article">
                  <img src={list.image} className="w-24 h-24 rounded-[24px] object-cover shadow-xl" alt={list.title} />
                  <div className="flex-1">
                    <h3 className="font-black text-xl text-primary-dark">{list.title}</h3>
                    <p className="text-sm font-bold text-neutral">📍 {list.location} · 👁️ {list.views_count || 0} views</p>
                  </div>
                  <Button variant="outline" className="rounded-xl font-black h-11 px-8 focus:ring-4 focus:ring-primary/10" onClick={() => { setEditingProperty(list); setIsModalOpen(true); }}>Edit</Button>
                </Card>
              )) : (
                <div className="py-32 bg-neutral-light rounded-[48px] text-center space-y-6 shadow-inner">
                  <div className="text-7xl opacity-20" aria-hidden="true">🏠</div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-primary-dark">No Listings Yet</h3>
                    <p className="text-neutral font-medium text-lg px-4">You haven't posted any properties yet. Start listing to reach more clients.</p>
                  </div>
                  <Button onClick={() => { setEditingProperty(null); setIsModalOpen(true); }} className="rounded-[24px] font-black px-10 h-14 text-lg shadow-xl shadow-primary/20">Create First Listing</Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="border-2 border-neutral/5 rounded-[48px] overflow-hidden bg-white shadow-2xl divide-y-2 divide-neutral/5">
              {isLoadingMessages ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="p-10 flex gap-8">
                    <Skeleton className="w-16 h-16 rounded-[24px] shrink-0" />
                    <div className="flex-1 space-y-4">
                      <Skeleton className="h-6 w-1/4" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))
              ) : dbMessages.length > 0 ? dbMessages.map(msg => (
                <div key={msg.id} className={cn("p-10 flex gap-8 transition-all", !msg.read ? "bg-primary/[0.02]" : "opacity-60")}>
                  <div className="w-16 h-16 bg-primary/10 rounded-[24px] flex items-center justify-center text-primary font-black text-xl shadow-inner uppercase shrink-0" aria-hidden="true">{msg.sender_name.charAt(0)}</div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-black text-primary-dark text-xl">{msg.sender_name}</h4>
                    <p className="text-sm font-black text-primary/70 uppercase">Inquiry: {msg.property_title}</p>
                    <p className="text-base text-neutral font-medium italic">"{msg.message}"</p>
                  </div>
                  {!msg.read && <Button variant="outline" size="sm" className="rounded-xl font-black border-2 focus:ring-4 focus:ring-primary/10" onClick={() => handleMarkAsRead(msg.id)}>Mark Read</Button>}
                </div>
              )) : (
                <div className="p-32 text-center space-y-6">
                  <div className="text-7xl opacity-20" aria-hidden="true">✉️</div>
                  <h3 className="text-3xl font-black text-primary-dark">No Messages</h3>
                  <p className="text-neutral font-medium text-lg px-4">Inquiries from potential clients will appear here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && <ProfileSettings />}
          
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <Card className="p-8 bg-primary text-white border-none shadow-2xl rounded-[40px]"><p className="text-xs font-black uppercase opacity-60">Total Views</p><h3 className="text-5xl font-black mt-2">{totalViews}</h3></Card>
               <Card className="p-8 bg-accent text-white border-none shadow-2xl rounded-[40px]"><p className="text-xs font-black uppercase opacity-60">Inquiries</p><h3 className="text-5xl font-black mt-2">{dbMessages.length}</h3></Card>
               <Card className="p-8 bg-neutral-dark text-white border-none shadow-2xl rounded-[40px]"><p className="text-xs font-black uppercase opacity-60">Rate</p><h3 className="text-5xl font-black mt-2">{totalViews > 0 ? ((dbMessages.length / totalViews) * 100).toFixed(1) : 0}%</h3></Card>
            </div>
          )}
        </main>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Manage Listing" className="max-w-2xl rounded-[48px]">
        <PropertyForm onSuccess={() => setIsModalOpen(false)} initialData={editingProperty} />
      </Modal>
    </div>
  );
}
