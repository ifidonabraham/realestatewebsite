'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Textarea } from '../ui/Input';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

const listingSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  location: z.string().min(5, 'Please provide a specific location'),
  price: z.string().min(1, 'Price is required'),
  type: z.string().min(1, 'Please select a type'),
  category: z.enum(['Residential', 'Land', 'Commercial']),
  status: z.string().default('For Sale'),
  beds: z.string().optional(),
  baths: z.string().optional(),
  sqft: z.string().min(1, 'Area is required'),
  description: z.string().min(20, 'Detailed description required'),
  image_url: z.string().url('Please enter a valid main image URL'),
  gallery: z.array(z.object({ url: z.string().url('Invalid URL') })).optional()
});

export default function PropertyForm({ onSuccess, initialData = null }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const isEditing = !!initialData;

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: initialData ? {
      ...initialData,
      price: String(initialData.price),
      beds: initialData.beds ? String(initialData.beds) : '',
      baths: initialData.baths ? String(initialData.baths) : '',
      sqft: String(initialData.sqft),
      gallery: initialData.gallery?.map(url => ({ url })) || []
    } : { 
      category: 'Residential', 
      status: 'For Sale', 
      type: 'House',
      gallery: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "gallery"
  });

  const selectedCategory = watch('category');

  const onFormSubmit = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...values,
        price: Number(values.price),
        beds: values.beds ? Number(values.beds) : null,
        baths: values.baths ? Number(values.baths) : null,
        sqft: Number(values.sqft),
        gallery: values.gallery?.map(item => item.url) || [],
        agent_id: user.id,
        agent_name: user.user_metadata.full_name || 'Agent',
        agent_email: user.email
      };

      let res;
      if (isEditing) {
        res = await supabase.from('properties').update(payload).eq('id', initialData.id);
      } else {
        res = await supabase.from('properties').insert([payload]);
      }

      if (res.error) throw res.error;
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-8 max-h-[75vh] overflow-y-auto px-2 py-2" onSubmit={handleSubmit(onFormSubmit)}>
      {error && <div className="p-4 bg-red-50 text-red-500 rounded-2xl font-bold">⚠️ {error}</div>}
      
      {/* Category Select */}
      <div className="space-y-2">
        <label className="text-xs font-black text-primary-dark uppercase tracking-widest">Property Category</label>
        <select 
          {...register('category')}
          disabled={isEditing}
          className="flex h-12 w-full rounded-2xl border-2 border-neutral/10 bg-white px-4 py-2 text-sm font-bold focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer"
        >
          <option value="Residential">Residential</option>
          <option value="Land">Land</option>
          <option value="Commercial">Commercial</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Title" {...register('title')} error={errors.title?.message} placeholder="e.g. Modern Villa" />
        <Input label="Location" {...register('location')} error={errors.location?.message} placeholder="e.g. Lekki, Lagos" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input label="Price (₦)" type="number" {...register('price')} error={errors.price?.message} />
        <div className="space-y-2">
          <label className="text-xs font-black text-primary-dark uppercase tracking-widest">Type</label>
          <select {...register('type')} className="flex h-12 w-full rounded-2xl border-2 border-neutral/10 bg-white px-4 py-2 text-sm font-bold">
            {selectedCategory === 'Residential' && <><option value="House">House</option><option value="Apartment">Apartment</option><option value="Shortlet">Shortlet</option></>}
            {selectedCategory === 'Land' && <option value="Plot">Plot</option>}
            {selectedCategory === 'Commercial' && <option value="Office">Office</option>}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-primary-dark uppercase tracking-widest">Status</label>
          <select {...register('status')} className="flex h-12 w-full rounded-2xl border-2 border-neutral/10 bg-white px-4 py-2 text-sm font-bold">
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
            <option value="Available">Available</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-neutral-light/50 rounded-[32px] border border-neutral/5">
        {selectedCategory === 'Residential' && (
          <><Input label="Beds" type="number" {...register('beds')} /><Input label="Baths" type="number" {...register('baths')} /></>
        )}
        <Input label={selectedCategory === 'Land' ? "Area (sqm)" : "Area (sqft)"} type="number" {...register('sqft')} error={errors.sqft?.message} />
      </div>

      {/* Images Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-primary-dark uppercase tracking-widest flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Images (URLs)
        </h3>
        <Input label="Main Image URL" {...register('image_url')} error={errors.image_url?.message} placeholder="https://images.unsplash.com/..." />
        
        <div className="space-y-3 pl-4 border-l-2 border-neutral/10">
          <p className="text-[10px] font-bold text-neutral uppercase tracking-widest">Additional Photos</p>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Input 
                {...register(`gallery.${index}.url`)} 
                placeholder="Gallery Image URL" 
                error={errors.gallery?.[index]?.url?.message}
              />
              <Button 
                variant="ghost" 
                className="h-12 w-12 rounded-2xl text-red-500 bg-red-50 shrink-0"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-dashed rounded-xl py-6 gap-2"
            onClick={() => append({ url: '' })}
          >
            <Plus className="w-4 h-4" /> Add More Photos
          </Button>
        </div>
      </section>

      <Textarea label="Description" {...register('description')} error={errors.description?.message} />

      <Button type="submit" className="w-full h-16 rounded-[24px] font-black text-lg shadow-xl" disabled={loading}>
        {loading ? 'Processing...' : isEditing ? 'Save Changes' : 'Publish Listing'}
      </Button>
    </form>
  );
}
