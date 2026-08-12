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
    btn.textContent = loading ? 'Signing in…' : 'Sign In';
  }

  function initPasswordToggle() {
    const toggle = document.getElementById('passwordToggle');
    const input = document.getElementById('password');

    if (!toggle || !input) {
      return;
    }

    toggle.addEventListener('click', function () {
      const isPassword = input.type === 'password';

      input.type = isPassword ? 'text' : 'password';
      toggle.querySelector('.icon-eye').classList.toggle('hidden', !isPassword);
      toggle.querySelector('.icon-eye-off').classList.toggle('hidden', isPassword);
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

  function boot() {
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
