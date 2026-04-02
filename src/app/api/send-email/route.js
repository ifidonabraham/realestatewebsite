import emailjs from '@emailjs/nodejs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    const serviceId = process.env.EMAILJS_SERVICE_ID || 'service_trd0xoa';
    const templateId = process.env.EMAILJS_TEMPLATE_ID || 'template_new_inquiry';
    const publicKey = process.env.EMAILJS_PUBLIC_KEY || 'zinBnzY4P-odk1F3h';
    const privateKey = process.env.EMAILJS_PRIVATE_KEY; // Only available on server

    await emailjs.send(
      serviceId,
      templateId,
      {
        agent_email: data.agent_email,
        sender_name: data.sender_name,
        sender_email: data.sender_email,
        property_title: data.property_title,
        message: data.message,
        time: new Date().toLocaleString(),
      },
      {
        publicKey,
        privateKey,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email API Error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
