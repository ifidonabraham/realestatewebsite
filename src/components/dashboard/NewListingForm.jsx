'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input, Textarea } from '../ui/Input';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const listingSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  location: z.string().min(5, 'Please provide a more specific location'),
  price: z.string().min(1, 'Price is required'),
  type: z.string().min(1, 'Please select a property type'),
  status: z.enum(['For Sale', 'For Rent']),
  beds: z.string().optional(),
  baths: z.string().optional(),
  sqft: z.string().min(1, 'Area/Size is required'),
  description: z.string().min(20, 'Please provide a more detailed description')
});

export default function NewListingForm({ onSuccess }) {
  const { user } = useAuth();
  const [category, setCategory] = useState('Residential');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: { status: 'For Sale', type: 'House' }
  });

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat === 'Land') {
      setValue('beds', '');
      setValue('baths', '');
      setValue('type', 'Plot');
    } else if (cat === 'Commercial') {
      setValue('type', 'Office');
    } else {
      setValue('type', 'House');
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('property-images')
      .upload(filePath, imageFile);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const onFormSubmit = async (values) => {
    setUploading(true);
    setError(null);
    try {
      const image_url = await uploadImage();
      
      const { error: dbError } = await supabase
        .from('properties')
        .insert([{
          ...values,
          price: Number(values.price),
          beds: values.beds ? Number(values.beds) : null,
          baths: values.baths ? Number(values.baths) : null,
          sqft: Number(values.sqft),
          category,
          image_url,
          agent_id: user.id,
          agent_name: user.user_metadata.full_name || 'Agent',
          agent_email: user.email
        }]);

      if (dbError) throw dbError;
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="space-y-8 max-h-[75vh] overflow-y-auto px-1 py-2" onSubmit={handleSubmit(onFormSubmit)}>
      {error && <div className="p-4 bg-red-50 text-red-500 rounded-2xl font-bold">⚠️ {error}</div>}
      
      {/* Category Selector */}
      <section className="space-y-3">
        <label className="text-xs font-black text-primary-dark uppercase tracking-widest">Category</label>
        <div className="flex gap-2 p-1.5 bg-neutral-light rounded-[20px]">
          {['Residential', 'Land', 'Commercial'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase ${category === cat ? "bg-white shadow-lg text-primary" : "text-neutral"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Image Upload Field */}
      <section className="space-y-3">
        <label className="text-xs font-black text-primary-dark uppercase tracking-widest text-center block">Property Photo</label>
        <div className="relative h-40 bg-neutral-light rounded-[32px] border-4 border-dashed border-neutral/10 flex flex-col items-center justify-center group hover:border-primary/20 transition-colors">
          {imageFile ? (
            <p className="text-primary font-black text-sm">{imageFile.name}</p>
          ) : (
            <>
              <span className="text-4xl mb-2">📸</span>
              <p className="text-xs font-bold text-neutral uppercase">Click to upload main photo</p>
            </>
          )}
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Property Title" {...register('title')} error={errors.title?.message} />
        <Input label="Exact Location" {...register('location')} error={errors.location?.message} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input label="Price (₦)" type="number" {...register('price')} error={errors.price?.message} />
        <div className="space-y-2">
          <label className="text-xs font-black text-primary-dark uppercase tracking-widest text-center block">Type</label>
          <select {...register('type')} className="flex h-12 w-full rounded-2xl border-2 border-neutral/10 bg-white px-4 py-2 text-sm font-bold appearance-none cursor-pointer">
            {category === 'Residential' && <><option value="House">House</option><option value="Apartment">Apartment</option></>}
            {category === 'Land' && <option value="Plot">Plot</option>}
            {category === 'Commercial' && <option value="Office">Office</option>}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-primary-dark uppercase tracking-widest text-center block">Status</label>
          <select {...register('status')} className="flex h-12 w-full rounded-2xl border-2 border-neutral/10 bg-white px-4 py-2 text-sm font-bold appearance-none cursor-pointer">
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
          </select>
        </div>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-neutral-light/50 rounded-[32px]">
        {category !== 'Land' && (
          <><Input label="Beds" type="number" {...register('beds')} /><Input label="Baths" type="number" {...register('baths')} /></>
        )}
        <Input label="Area" type="number" {...register('sqft')} />
      </section>

      <Textarea label="Description" {...register('description')} error={errors.description?.message} />

      <Button type="submit" className="w-full h-16 rounded-[24px] text-lg font-black uppercase" disabled={uploading}>
        {uploading ? 'Processing Listing...' : 'Publish to Marketplace'}
      </Button>
    </form>
  );
}
