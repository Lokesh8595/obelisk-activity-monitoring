/**
 * Login page — authenticates against demo credentials and redirects to dashboard.
 */
(function () {
  const TS = () => window.TrackingService;

  function showError(message) {
    const el = document.getElementById('loginError');

    if (!el) {
      return;
    }

    el.textContent = message;
    el.classList.remove('hidden');
  }

  function hideError() {
    const el = document.getElementById('loginError');

    if (el) {
      el.classList.add('hidden');
      el.textContent = '';
    }
  }

  function setLoading(loading) {
    const btn = document.getElementById('loginBtn');

    if (!btn) {
      return;
    }

    btn.disabled = loading;
    btn.innerHTML = loading
      ? '<i class="pi pi-spin pi-spinner"></i> Signing in…'
      : '<i class="pi pi-sign-in"></i> Sign In';
  }

  function initPasswordToggle() {
    const toggle = document.getElementById('passwordToggle');
    const input = document.getElementById('password');

    if (!toggle || !input) {
      return;
    }

    toggle.addEventListener('click', function () {
      const isPassword = input.type === 'password';
      const icon = toggle.querySelector('i');

      input.type = isPassword ? 'text' : 'password';

      if (icon) {
        icon.className = isPassword ? 'pi pi-eye-slash' : 'pi pi-eye';
      }

      toggle.title = isPassword ? 'Hide password' : 'Show password';
    });
  }

  function initLoginForm() {
    const form = document.getElementById('loginForm');

    if (!form) {
      return;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      hideError();

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      const rememberMe = document.getElementById('rememberMe').checked;

      if (!username || !password) {
        showError('Please enter both username and password.');
        return;
      }

      setLoading(true);

      setTimeout(function () {
        const result = TS().login(username, password, rememberMe);

        if (result.status === 'success') {
          window.location.href = 'dashboard.html';
          return;
        }

        setLoading(false);
        showError(result.message || 'Invalid username or password.');
      }, 400);
    });
  }

  function applySavedTheme() {
    try {
      if (localStorage.getItem('obelisk-dark') === '1') {
        document.documentElement.classList.add('app-dark');
      }
    } catch (e) {
      /* ignore */
    }
  }

  function initDynamicBranding() {
    fetch('/api/v1/configs')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const cfg = data && (data.data || data.config || data);

        if (cfg && window.ObeliskApp && typeof window.ObeliskApp.applyBrandColor === 'function' && cfg.primaryColor) {
          window.ObeliskApp.applyBrandColor(cfg.primaryColor, cfg.secondaryColor);
        }

        if (cfg && (cfg.title || cfg.appTitle)) {
          document.title = cfg.title || cfg.appTitle;
        }
      })
      .catch(function () {
        /* optional API */
      });
  }

  function boot() {
    applySavedTheme();
    initDynamicBranding();

    if (TS().isAuthenticated()) {
      window.location.href = 'dashboard.html';
      return;
    }

    initPasswordToggle();
    initLoginForm();
    document.getElementById('username').focus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
