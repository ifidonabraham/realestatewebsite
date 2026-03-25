   // require login: redirect to login if not signed in ...this is from showcase line:after 213
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
      localStorage.setItem('postLoginRedirect', window.location.pathname);
      window.location.href = 'login.html';
    }

    const API = (window.APP_CONFIG && window.APP_CONFIG.API_BASE) ? window.APP_CONFIG.API_BASE : 'http://localhost:3000';
    const stack = document.getElementById('stack');
    const locationSelect = document.getElementById('locationSelect');
    const seedBtn = document.getElementById('seedBtn');
    const refreshBtn = document.getElementById('refreshBtn');