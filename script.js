/*
  Central client script.
  - Uses window.APP_CONFIG if present (API_BASE / SUPABASE_URL / SUPABASE_KEY / SOCKET_URL)
  - Falls back to local json-server endpoints (http://localhost:3000)
  - Exposes contactAgent, verifyUser, sendResetCode, resetPassword to global window
*/
console.log('script.js loaded');

const CONFIG = window.APP_CONFIG || {};
const API_BASE = CONFIG.API_BASE || 'http://localhost:3000';
const SUPABASE_URL = CONFIG.SUPABASE_URL || '';
const SUPABASE_KEY = CONFIG.SUPABASE_KEY || '';

let supabase = null;
(async function maybeInitSupabase(){
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
      supabase = mod.createClient(SUPABASE_URL, SUPABASE_KEY);
      console.log('Supabase client initialized');
    } catch (e) {
      console.warn('Supabase init failed', e);
      supabase = null;
    }
  }
})();

// helper: get current user (supports different storage keys)
function getCurrentUser(){
  return JSON.parse(localStorage.getItem('currentUser') || localStorage.getItem('loggedInUser') || 'null');
}

function escapeHTML(s){ if (s==null) return ''; return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ---------- Properties listing ---------- */
const propertyList = document.getElementById('propertyList');
const searchBox = document.getElementById('searchBox');
const priceFilter = document.getElementById('priceFilter');

let allProperties = [];

function displayProperties(properties){
  if (!propertyList) return;
  propertyList.innerHTML = properties.map(p => `
    <article class="prop-card">
      <div class="prop-media">${p.image ? `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)}">` : ''}</div>
      <div class="prop-body">
        <h3>${escapeHTML(p.title)}</h3>
        <div class="meta"><strong>Location:</strong> ${escapeHTML(p.location || '')} · <strong>Agent:</strong> ${escapeHTML(p.agent || '')}</div>
        <p class="price">${p.price ? '$' + Number(p.price).toLocaleString() : ''}</p>
        <p class="desc">${escapeHTML(p.description || '')}</p>
        <div class="actions"><button class="btn-contact" data-agent="${escapeHTML(p.agent || '')}">Contact Agent</button></div>
      </div>
    </article>
  `).join('');
  // wire contact buttons
  propertyList.querySelectorAll('.btn-contact').forEach(btn => {
    btn.addEventListener('click', () => contactAgent(btn.dataset.agent));
  });
}

function filterAndDisplay(){
  let filtered = allProperties.slice();
  const text = searchBox?.value?.trim().toLowerCase();
  if (text) {
    filtered = filtered.filter(p => (p.title||'').toLowerCase().includes(text) || (p.location||'').toLowerCase().includes(text));
  }
  const pf = priceFilter?.value || '';
  if (pf) {
    filtered = filtered.filter(p => {
      const price = Number(p.price || 0);
      if (pf === 'low') return price < 500;
      if (pf === 'medium') return price >= 500 && price <= 1000;
      if (pf === 'high') return price > 1000;
      return true;
    });
  }
  displayProperties(filtered);
}

async function fetchProperties(){
  try {
    const res = await fetch(`${API_BASE}/properties`);
    allProperties = await res.json();
    filterAndDisplay();
  } catch (e) {
    console.error('fetchProperties error', e);
  }
}

if (propertyList) {
  fetchProperties();
  searchBox?.addEventListener('input', filterAndDisplay);
  priceFilter?.addEventListener('change', filterAndDisplay);
}

/* ---------- Contact Agent (global) ---------- */
async function contactAgent(agentEmail){
  const client = getCurrentUser();
  if (!client) { alert('You must be logged in to contact an agent.'); window.location.href = 'login.html'; return; }
  const message = prompt('Enter your message for the agent:');
  if (!message) return;
  const payload = { client: client.email || client.user?.email, agent: agentEmail, message, timestamp: new Date().toISOString() };
  try {
    if (supabase) {
      await supabase.from('messages').insert(payload);
    } else {
      await fetch(`${API_BASE}/messages`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
    }
    alert('Message sent successfully!');
  } catch (e) {
    console.error('contactAgent error', e);
    alert('Failed to send message.');
  }
}
window.contactAgent = contactAgent;

/* ---------- Agent message viewer (agent dashboard) ---------- */
const messageList = document.getElementById('messageList');
if (messageList) {
  (async ()=>{
    const agent = getCurrentUser();
    if (!agent) { alert('You must be logged in to view messages.'); window.location.href = 'login.html'; return; }
    try {
      let messages = [];
      if (supabase) {
        const { data } = await supabase.from('messages').select('*').eq('agent', agent.email);
        messages = data || [];
      } else {
        const res = await fetch(`${API_BASE}/messages`);
        messages = await res.json();
        messages = messages.filter(m => m.agent === agent.email);
      }
      messageList.innerHTML = messages.length ? messages.map(m => `<p><strong>${escapeHTML(m.client)}:</strong> ${escapeHTML(m.message)}</p><hr>`).join('') : '<p>No messages yet.</p>';
    } catch (e) {
      console.error('agent messages error', e);
    }
  })();
}

/* ---------- Registration ---------- */
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.getElementById('name')||{}).value?.trim();
    const email = (document.getElementById('email')||{}).value?.trim();
    const phone = (document.getElementById('phone')||{}).value?.trim();
    const password = (document.getElementById('password')||{}).value || '';
    const role = (document.getElementById('role')||{}).value || 'client';

    if (!email || !password) { alert('Please provide email and password'); return; }

    try {
      if (supabase) {
        const { data: signUp, error: signErr } = await supabase.auth.signUp({ email, password });
        if (signErr) { alert('Signup error: ' + signErr.message); return; }
        const profile = { name, email, phone, type: role, created_at: new Date().toISOString() };
        const { data, error } = await supabase.from('users').insert(profile).select().single();
        if (error) throw error;
        localStorage.setItem('currentUser', JSON.stringify(data));
      } else {
        // check exists
        const r = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}`);
        const existing = await r.json();
        if (existing.length) { alert('Email already registered.'); return; }
        const res = await fetch(`${API_BASE}/users`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ name, email, phone, password, type: role }) });
        const created = await res.json();
        localStorage.setItem('currentUser', JSON.stringify(created));
      }
      alert('Registration successful!');
      window.location.href = (role === 'agent') ? 'agent.html' : 'client.html';
    } catch (err) {
      console.error('register error', err);
      alert('Registration failed.');
    }
  });
}

/* ---------- Verification ---------- */
async function verifyUser(){
  const enteredCode = (document.getElementById('verificationCode')||{}).value;
  const pending = JSON.parse(localStorage.getItem('pendingVerification') || 'null');
  if (!pending) { alert('No verification found.'); return; }
  try {
    if (supabase) {
      const { data } = await supabase.from('users').select('*').eq('email', pending.email).single();
      if (!data) { alert('User not found'); return; }
      if (String(data.verificationCode) === String(enteredCode)) {
        await supabase.from('users').update({ verified: true }).eq('id', data.id);
        alert('Verification successful'); localStorage.removeItem('pendingVerification'); window.location.href = 'login.html';
      } else { alert('Incorrect code'); }
    } else {
      const res = await fetch(`${API_BASE}/users?email=${encodeURIComponent(pending.email)}`);
      const users = await res.json();
      const user = users[0];
      if (!user) { alert('User not found'); return; }
      if (String(user.verificationCode) === String(enteredCode)) {
        await fetch(`${API_BASE}/users/${user.id}`, { method:'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ verified: true }) });
        alert('Verification successful'); localStorage.removeItem('pendingVerification'); window.location.href = 'login.html';
      } else { alert('Incorrect code'); }
    }
  } catch (e) { console.error('verify error', e); alert('Verification failed'); }
}
window.verifyUser = verifyUser;

/* ---------- Reset password ---------- */
async function sendResetCode(){
  const input = (document.getElementById('resetInput')||{}).value;
  if (!input) { alert('Enter email or phone'); return; }
  try {
    if (supabase) {
      const { data: user } = await supabase.from('users').select('*').or(`email.eq.${input},phone.eq.${input}`).single();
      if (!user) { alert('No account found'); return; }
      const resetCode = String(Math.floor(100000 + Math.random()*900000));
      await supabase.from('users').update({ resetCode }).eq('id', user.id);
      localStorage.setItem('resetUser', JSON.stringify({ id: user.id, resetCode }));
      alert('Reset code generated.'); window.location.href = 'new-password.html';
    } else {
      const res = await fetch(`${API_BASE}/users`);
      const users = await res.json();
      const user = users.find(u => u.email === input || u.phone === input);
      if (!user) { alert('No account found'); return; }
      const resetCode = String(Math.floor(100000 + Math.random()*900000));
      await fetch(`${API_BASE}/users/${user.id}`, { method:'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ resetCode }) });
      localStorage.setItem('resetUser', JSON.stringify({ id: user.id, resetCode }));
      alert('Reset code saved.'); window.location.href = 'new-password.html';
    }
  } catch (e) { console.error('sendResetCode error', e); alert('Failed to generate reset code'); }
}
window.sendResetCode = sendResetCode;

async function resetPassword(){
  const ru = JSON.parse(localStorage.getItem('resetUser') || 'null');
  if (!ru) { alert('No reset request'); return; }
  const entered = (document.getElementById('resetCode')||{}).value;
  const newPassword = (document.getElementById('newPassword')||{}).value;
  if (!entered || !newPassword) { alert('Fill fields'); return; }
  if (entered !== String(ru.resetCode)) { alert('Invalid code'); return; }
  try {
    if (supabase) {
      await supabase.from('users').update({ password: newPassword, resetCode: null }).eq('id', ru.id);
    } else {
      await fetch(`${API_BASE}/users/${ru.id}`, { method:'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ password: newPassword, resetCode: null }) });
    }
    alert('Password reset successful'); localStorage.removeItem('resetUser'); window.location.href = 'login.html';
  } catch (e) { console.error('resetPassword error', e); alert('Failed to reset password'); }
}
window.resetPassword = resetPassword;

/* ---------- Login form handling ---------- */
(async function attachLogin(){
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (loginForm.querySelector('#email') || {}).value?.trim();
    const password = (loginForm.querySelector('#password') || {}).value || '';
    if (!email || !password) { alert('Enter email and password'); return; }
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { alert('Login failed: ' + error.message); return; }
        // fetch profile
        const { data: profile } = await supabase.from('users').select('*').eq('email', email).single();
        localStorage.setItem('currentUser', JSON.stringify(profile || data.user));
        const redirect = localStorage.getItem('postLoginRedirect') || (profile?.type === 'agent' ? 'agent.html' : 'client.html') || 'showcase.html';
        localStorage.removeItem('postLoginRedirect');
        window.location.href = redirect;
      } else {
        const res = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
        const users = await res.json();
        if (!users || users.length === 0) { alert('Invalid credentials'); return; }
        const user = users[0];
        localStorage.setItem('currentUser', JSON.stringify(user));
        const redirect = localStorage.getItem('postLoginRedirect') || (user.type === 'agent' ? 'agent.html' : 'client.html') || 'showcase.html';
        localStorage.removeItem('postLoginRedirect');
        window.location.href = redirect;
      }
    } catch (err) {
      console.error('login error', err);
      alert('Login failed');
    }
  });
})();

/* ---------- Property upload form ---------- */
const propertyForm = document.getElementById('propertyForm') || document.getElementById('propertyUploadForm');
if (propertyForm) {
  propertyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = (document.getElementById('title')||document.getElementById('propertyTitle')||{}).value || '';
    const location = (document.getElementById('location')||document.getElementById('propertyLocation')||{}).value || '';
    const price = (document.getElementById('price')||document.getElementById('propertyPrice')||{}).value || '';
    const description = (document.getElementById('description')||document.getElementById('propertyDescription')||{}).value || '';
    const agent = getCurrentUser();
    if (!agent) { alert('You must be logged in to upload a property.'); window.location.href = 'login.html'; return; }
    const payload = { title, location, price, description, agent: agent.email || agent.user?.email, created_at: new Date().toISOString() };
    try {
      if (supabase) {
        await supabase.from('properties').insert(payload);
      } else {
        await fetch(`${API_BASE}/properties`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
      }
      alert('Property uploaded successfully!');
      propertyForm.reset();
      // refresh property list if present
      if (propertyList) fetchProperties();
    } catch (err) { console.error('property upload error', err); alert('Failed to upload property'); }
  });
}

/* ---------- Logout helper (global) ---------- */
function logout(){
  localStorage.removeItem('currentUser');
  if (supabase) supabase.auth.signOut().catch(()=>{});
  window.location.href = 'login.html';
}
window.logout = logout;