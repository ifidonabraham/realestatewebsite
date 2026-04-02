# Omega Real Estate | Nationwide Property Finder (Nigeria)

[![Deploy with Vercel](https://vercel.com/button)](https://realestatewebsite-omega.vercel.app)

Omega Real Estate is a premium, high-trust marketplace designed to connect buyers, renters, and verified agents across all 36 states in Nigeria. 

## 🌟 Strategic Goals
1. **Inform & Educate:** Clear, accurate property data and market insights.
2. **Engagement:** Seamless communication between clients and agents.
3. **Efficiency:** Advanced nationwide search and listing management.
4. **Inclusivity:** Mobile-first design optimized for Nigerian network conditions.
5. **Trust:** Verified agent system with "Blue Check" infrastructure.
6. **Awareness:** Driving visibility for nationwide real estate opportunities.
7. **User Experience:** Fast, intuitive, and high-end aesthetic.

## 🛠️ Technical Stack
- **Frontend:** Next.js 15+ (App Router), React, Tailwind CSS v4.
- **Backend:** Supabase (Auth, PostgreSQL, Real-time).
- **Media:** Git LFS (Large File Storage) for high-res property media.
- **Notifications:** Integrated secure API routes for Email inquiries.
- **UI/UX:** Lucide-React icons, Sonner toasts, Skeleton loading states.

## 🚀 Key Features
- **Nationwide Marketplace:** Filter by state, property type (Schools, Hotels, Industrial, etc.), and price.
- **Property Wanted:** A unique "Request" system where agents can post what their clients need.
- **Agent Dashboard:** Complete management of listings, inquiries, and analytics.
- **Security:** Server-side API protection and Row Level Security (RLS).
- **Responsive:** Fluid experience from mobile Android devices to 4K desktops.

## ⚙️ Setup & Installation

### Local Development
1. **Clone the repo:**
   ```bash
   git clone https://github.com/ifidonabraham/realestatewebsite.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Variables:**
   Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   EMAILJS_PRIVATE_KEY=your_private_key
   ```
4. **Run the project:**
   ```bash
   npm run dev
   ```

### Database Setup
Refer to the `SUPABASE_SETUP.sql` file in the root directory for the full schema and security policies.

## 🛡️ Security Note
This project implements strict **Row Level Security (RLS)**. Ensure all policies are active in your Supabase dashboard before public use.

---
**Developed by Omega PM**
