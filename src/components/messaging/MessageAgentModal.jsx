'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import Button from '../ui/Button';

import { supabase } from '../../lib/supabase';
import emailjs from '@emailjs/browser';

const messageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export default function MessageAgentModal({ isOpen, onClose, property }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [dbError, setDbError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: `I'm interested in the "${property?.title || 'this property'}" located at ${property?.location || 'your listed address'}. Please provide more details.`
    }
  });

  const sendEmailNotification = async (data) => {
    try {
      const serviceId = 'service_trd0xoa'; 
      const templateId = 'template_new_inquiry'; 
      const publicKey = 'zinBnzY4P-odk1F3h'; // Your Real Public Key

      await emailjs.send(
        serviceId,
        templateId,
        {
          agent_email: property.agent.email,
          sender_name: data.name,
          sender_email: data.email,
          property_title: property.title,
          message: data.message,
          time: new Date().toLocaleString(), // Added time variable
        },
        publicKey
      );
    } catch (err) {
      console.warn('Email notification failed but message was saved to database.');
    }
  };

  const onSubmit = async (data) => {
    setDbError(null);
    
    const { error } = await supabase
      .from('messages')
      .insert([
        {
          property_id: String(property.id),
          property_title: property.title,
          agent_email: property.agent.email,
          sender_name: data.name,
          sender_email: data.email,
          sender_phone: data.phone,
          message: data.message,
        },
      ]);

    if (error) {
      setDbError('Failed to send message.');
      return;
    }

    // Trigger Email notification in background
    sendEmailNotification(data);
    
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      reset();
      onClose();
    }, 3000);
  };

  if (!property) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Contact Agent for ${property.title}`}
      className="max-w-xl rounded-[40px]"
    >
      {!isSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="p-4 bg-neutral-light/50 rounded-2xl border border-neutral/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm border-2 border-white">
               <img src={property.image} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="space-y-0.5">
               <p className="text-[10px] font-black text-neutral uppercase tracking-widest">Inquiry For</p>
               <p className="text-sm font-bold text-primary-dark line-clamp-1">{property.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Your Full Name" 
              {...register('name')}
              error={errors.name?.message}
              placeholder="e.g. Adebayo Ogunlesi"
            />
            <Input 
              label="Email Address" 
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="e.g. adebayo@example.com"
            />
          </div>

          <Input 
            label="Phone Number (Optional)" 
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="e.g. +234 800 000 0000"
          />

          <Textarea 
            label="Your Message" 
            {...register('message')}
            error={errors.message?.message}
            className="min-h-[120px]"
          />

          <div className="pt-4 border-t border-neutral/10">
            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending Inquiry...' : 'Send Message to Agent'}
            </Button>
            <p className="text-center text-[10px] font-bold text-neutral uppercase tracking-[0.2em] mt-4">
               The agent will respond to your email.
            </p>
          </div>
        </form>
      ) : (
        <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
           <div className="w-24 h-24 bg-green-500 text-white rounded-[32px] flex items-center justify-center mx-auto text-4xl shadow-2xl shadow-green-200">
             ✅
           </div>
           <div className="space-y-2">
             <h3 className="text-2xl font-black text-primary-dark tracking-tight">Message Sent Successfully!</h3>
             <p className="text-neutral font-medium">Your inquiry has been delivered to {property.agent.name}.</p>
           </div>
           <p className="text-xs font-black text-green-600 uppercase tracking-widest">Redirecting you back...</p>
        </div>
      )}
    </Modal>
  );
}
