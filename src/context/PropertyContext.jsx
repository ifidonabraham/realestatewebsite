'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { mockProperties } from '../data/mockProperties';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const PropertyContext = createContext();

export function PropertyProvider({ children }) {
  const { user } = useAuth();
  const [dbProperties, setDbProperties] = useState([]);
  const [favorites, setFavorites] = useState([]); // Stores property IDs
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '', type: 'Any Type', status: 'Any', minPrice: '', maxPrice: '', beds: '', baths: ''
  });

  // 1. Fetch Properties
  const fetchDBProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      const formatted = data.map(p => ({
        ...p,
        image: p.image_url || 'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?auto=format&fit=crop&w=800&q=80',
        formattedPrice: `₦${Number(p.price).toLocaleString()}`,
        agent: { name: p.agent_name, email: p.agent_email, phone: p.agent_phone }
      }));
      setDbProperties(formatted);
    }
    setLoading(false);
  };

  // 2. Fetch Favorites from Supabase
  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    const { data, error } = await supabase
      .from('favorites')
      .select('property_id')
      .eq('user_id', user.id);
    
    if (!error && data) {
      setFavorites(data.map(f => String(f.property_id)));
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchDBProperties(), fetchFavorites()]);
      setLoading(false);
    };
    init();
  }, [user]);

  const properties = useMemo(() => {
    const db = dbProperties.map(p => ({ ...p, isMock: false }));
    const mock = mockProperties.map(p => ({ ...p, isMock: true }));
    return [...db, ...mock];
  }, [dbProperties]);

  // 3. Favorite Actions
  const addToFavorites = async (propertyId) => {
    if (!user) return toast.error('Please sign in to save favorites');
    
    const prop = properties.find(p => String(p.id) === String(propertyId));
    const title = prop ? prop.title : 'Property';

    const idStr = String(propertyId);
    setFavorites(prev => [...prev, idStr]); // Optimistic update
    toast.success(`"${title}" added to favorites`);

    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: user.id, property_id: idStr }]);

    if (error) {
      console.error(error);
      toast.error(`Failed to save "${title}"`);
      setFavorites(prev => prev.filter(id => id !== idStr)); // Rollback
    }
  };

  const removeFromFavorites = async (propertyId) => {
    if (!user) return;
    
    const prop = properties.find(p => String(p.id) === String(propertyId));
    const title = prop ? prop.title : 'Property';

    const idStr = String(propertyId);
    setFavorites(prev => prev.filter(id => id !== idStr)); // Optimistic update
    toast.info(`"${title}" removed from favorites`);

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('property_id', idStr);

    if (error) {
      console.error(error);
      toast.error(`Failed to remove "${title}"`);
      setFavorites(prev => [...prev, idStr]); // Rollback
    }
  };

  const isFavorite = (propertyId) => favorites.includes(String(propertyId));

  const toggleFavorite = (propertyId) => {
    if (isFavorite(propertyId)) {
      removeFromFavorites(propertyId);
    } else {
      addToFavorites(propertyId);
    }
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      const matchLocation = !filters.location || prop.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchType = filters.type === 'Any Type' || prop.type === filters.type;
      const matchStatus = filters.status === 'Any' || prop.status === filters.status;
      const matchMinPrice = !filters.minPrice || prop.price >= Number(filters.minPrice);
      const matchMaxPrice = !filters.maxPrice || prop.price <= Number(filters.maxPrice);
      return matchLocation && matchType && matchStatus && matchMinPrice && matchMaxPrice;
    });
  }, [properties, filters]);

  return (
    <PropertyContext.Provider value={{ 
      properties, 
      filteredProperties, 
      favorites, 
      loading,
      toggleFavorite, 
      isFavorite,
      filters, 
      setFilters, 
      refreshProperties: fetchDBProperties 
    }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  return useContext(PropertyContext);
}
