# Technical Decision Record (TDR)

This document tracks the technical architecture decisions and transitions throughout the development of the Real Estate Finder.

## 1. Frontend: React/Next.js
**Decision:** Migrate from the current plain HTML/JS architecture to **React with Next.js**.

**Why?**
- **Next.js** provides built-in SEO optimizations, which are critical for property search platforms.
- **React Router** (if needed) or Next.js file-based routing ensures a smoother SPA experience without page reloads.
- Component-based architecture allows for a more maintainable and reusable code structure.

## 2. Styling: CSS Strategies
**Decision:** Standard **Vanilla CSS** (for flexibility) or potentially **Tailwind CSS** (for rapid development).
*Note: Currently, the project uses a single `styles.css` file.*

## 3. Backend Strategy: Incremental Complexity
**Decision:** Start with **JSON Server** for a local mock database, then migrate to **Supabase**.

**Why?**
- `json-server` (using `db.json`) allows for rapid development of the frontend without needing to set up a live database immediately.
- **Supabase** will eventually provide:
  - Robust **authentication** (replacing manual login logic).
  - A real-time **PostgreSQL** database (replacing `db.json`).
  - **Storage** for property images (replacing local image references).

## 4. Real-time Features
**Decision:** Use **Socket.io** or **Supabase Realtime**.
- Currently, a `chat-server.js` with `socket.io` exists in the codebase for handling messages between agents and clients.

## 5. Deployment
**Decision:** **Vercel** or **Netlify**.
- A `vercel-build` script exists in the `package.json`, which points towards using Vercel for hosting.
