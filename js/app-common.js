/**
 * Shared app init — mirrors src auth/entity workflow (localStorage token + activeEntityId).
 */
(function (global) {
  const TS = () => global.TrackingService;

  function initSidebar() {
    const toggle = document.getElementById('sidebarToggle');

    if (!toggle) {
      return;
    }

    toggle.addEventListener('click', function () {
      document.getElementById('sidebar').classList.toggle('collapsed');
      document.getElementById('appLayout').classList.toggle('sidebar-collapsed');
    });
  }

  function initEntitySelector() {
    const selector = document.querySelector('.entity-selector select');

    if (!selector) {
      return;
    }

    const entities = global.ObeliskStaticData.ENTITIES;
    const activeId = TS().getActiveEntityId();

    selector.innerHTML = entities
      .map((e) => `<option value="${e.id}"${e.id === activeId ? ' selected' : ''}>${e.name}</option>`)
      .join('');

    selector.addEventListener('change', function () {
      TS().setActiveEntityId(Number(this.value));
      global.ObeliskPages.reloadCurrentPage();
    });
  }

  function initHeaderDate() {
    const dateEl = document.querySelector('.header-date');

    if (dateEl) {
      dateEl.textContent = 'Mon, Aug 10, 2026';
    }
  }

  function initHeaderSync() {
    const syncEl = document.querySelector('.header-sync-status span:last-child');

    if (!syncEl) {
      return;
    }

    const entityId = TS().getActiveEntityId();
    const employees = TS().getEmployeesByEntity(entityId);
    const latest = employees.reduce((max, emp) => {
      if (!emp.lastReceivedAt) {
        return max;
      }

      return !max || new Date(emp.lastReceivedAt) > new Date(max) ? emp.lastReceivedAt : max;
    }, null);

    syncEl.textContent = `Last synced ${TS().getLastSyncedLabel(latest)}`;
  }

  function initSplashScreen() {
    const splash = document.getElementById('splashScreen');

    if (!splash) {
      return;
    }

    window.addEventListener('load', function () {
      setTimeout(function () {
        splash.classList.add('hidden');
      }, 600);
    });
  }

  function initUserProfile() {
    const footer = document.querySelector('.sidebar-footer');

    if (!footer) {
      return;
    }

    const username = localStorage.getItem('username') || 'admin';
    const nameEl = footer.querySelector('.user-name');
    const avatarEl = footer.querySelector('.user-avatar');

    if (nameEl) {
      nameEl.textContent = username.charAt(0).toUpperCase() + username.slice(1);
    }

    if (avatarEl) {
      const initials = username.slice(0, 2).toUpperCase();
      const statusDot = avatarEl.querySelector('.status-dot');

      avatarEl.textContent = '';
      avatarEl.appendChild(document.createTextNode(initials));

      if (statusDot) {
        avatarEl.appendChild(statusDot);
      } else {
        const dot = document.createElement('span');
        dot.className = 'status-dot';
        avatarEl.appendChild(dot);
      }
    }
  }

  function initLogout() {
    const footer = document.querySelector('.sidebar-footer');

    if (!footer || footer.querySelector('.logout-btn')) {
      return;
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'logout-btn';
    btn.title = 'Logout';
    btn.setAttribute('aria-label', 'Logout');
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';

    btn.addEventListener('click', function () {
      TS().logout();
      window.location.href = 'login.html';
    });

    footer.appendChild(btn);
  }

  function requireAuth() {
    const page = document.body.dataset.page;

    if (page === 'login') {
      return;
    }

    if (!TS().isAuthenticated()) {
      window.location.href = 'login.html';
    }
  }

  function initCommon() {
    requireAuth();
    TS().initAuthContext();
    TS().reclassifySegments(TS().getActiveEntityId());
    initSplashScreen();
    initSidebar();
    initUserProfile();
    initLogout();
    initEntitySelector();
    initHeaderDate();
    initHeaderSync();
  }

  global.ObeliskApp = {
    initCommon,
    initSidebar,
    initEntitySelector,
    initHeaderSync
  };
})(window);
