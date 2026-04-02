'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export default function ContactPage() {
  React.useEffect(() => {
    document.title = 'Contact | Omega Real Estate';
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form Submitted:', data);
    alert('Thank you for your message! We will get back to you soon.');
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primary-dark uppercase">Get in Touch</h1>
        <p className="text-lg text-neutral font-medium">
          Have questions about a property or want to partner with us? Our team is here to help you every step of the way.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Contact Information */}
        <section className="space-y-8" aria-labelledby="contact-info-title">
          <h2 id="contact-info-title" className="sr-only">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none bg-neutral-light p-8 space-y-4 shadow-inner">
              <span className="text-4xl" aria-hidden="true">📞</span>
              <h3 className="text-lg font-black text-primary-dark uppercase tracking-widest">Phone</h3>
              <p className="text-neutral font-bold">+234 800 000 0000</p>
              <p className="text-xs text-neutral/60 font-black uppercase">Mon-Fri: 9am - 6pm</p>
            </Card>
            
            <Card className="border-none bg-neutral-light p-8 space-y-4 shadow-inner">
              <span className="text-4xl" aria-hidden="true">📧</span>
              <h3 className="text-lg font-black text-primary-dark uppercase tracking-widest">Email</h3>
              <p className="text-neutral font-bold">hello@realestatefinder.ng</p>
              <p className="text-xs text-neutral/60 font-black uppercase">24/7 Support</p>
            </Card>
          </div>

          <div className="p-10 bg-primary-dark text-white rounded-[40px] space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
            <h3 className="text-2xl font-black uppercase tracking-widest">Our Head Office</h3>
            <address className="not-italic space-y-6">
              <p className="flex items-start gap-4 text-lg text-neutral-light/80 font-medium">
                <span className="text-accent text-2xl" aria-hidden="true">📍</span>
                123 Victoria Island, <br />
                Lagos, Nigeria.
              </p>
              <div className="aspect-video bg-white/5 rounded-[32px] flex items-center justify-center font-bold border-2 border-dashed border-white/10 group hover:border-accent transition-colors">
                <span className="text-white/40 group-hover:text-white transition-colors">Map View Placeholder</span>
              </div>
            </address>
          </div>
        </section>

        {/* Contact Form */}
        <Card className="border-neutral/10 shadow-2xl p-8 md:p-12 rounded-[48px]" as="section" aria-labelledby="form-title">
          <h2 id="form-title" className="text-2xl font-black text-primary-dark uppercase tracking-widest mb-8">Send a Message</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Full Name" 
                {...register('name')}
                error={errors.name?.message}
                placeholder="John Doe" 
              />
              <Input 
                label="Email Address" 
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="john@example.com" 
              />
            </div>
            
            <Input 
              label="Subject" 
              {...register('subject')}
              error={errors.subject?.message}
              placeholder="How can we help?" 
            />
            
            <Textarea 
              label="Message" 
              {...register('message')}
              error={errors.message?.message}
              placeholder="Type your message here..." 
            />
            
            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-16 rounded-[24px] text-lg font-black uppercase tracking-widest"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
            
            <p className="text-center text-[10px] font-bold text-neutral uppercase tracking-widest">
              By submitting this form, you agree to our <span className="underline cursor-pointer hover:text-primary">Privacy Policy</span>.
            </p>
          </form>
        </Card>

      </div>
    </div>
  );
}
