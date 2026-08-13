/**
 * Shared app init — Sakai-NG chrome, Aura tokens, entity workflow.
 *
 * LayoutService leftovers (NOT the visual brand):
 *   preset: 'Lara', primary: 'orange', menuMode: 'static'
 * Runtime look is Aura + navy #061944. Dark mode: class `.app-dark` on <html>.
 */
(function (global) {
  const TS = () => global.TrackingService;
  const DARK_KEY = 'obelisk-dark';
  const LAYOUT_CONFIG = {
    preset: 'Lara',
    primary: 'orange',
    menuMode: 'static',
    darkTheme: false
  };

  const MENU = [
    {
      label: 'Home',
      items: [
        { label: 'Dashboard', icon: 'pi-home', href: 'dashboard.html' }
      ]
    },
    {
      label: 'Monitoring',
      items: [
        { label: 'Employee Timeline', icon: 'pi-clock', href: 'employee-timeline.html' },
        { label: 'App & Web Activity', icon: 'pi-desktop', href: 'activity.html' },
        { label: 'Screenshots', icon: 'pi-camera', href: 'screenshots.html' },
        { label: 'Productivity', icon: 'pi-chart-bar', href: 'productivity.html' }
      ]
    },
    {
      label: 'Management',
      items: [
        { label: 'Timesheets', icon: 'pi-calendar', href: 'timesheets.html' },
        { label: 'Employees', icon: 'pi-users', href: 'employee-detail.html' }
      ]
    },
    {
      label: 'Administration',
      items: [
        { label: 'Monitoring Settings', icon: 'pi-cog', href: 'monitoring-settings.html' },
        { label: 'Productivity Rules', icon: 'pi-sliders-h', href: 'productivity-rules.html' },
        { label: 'Consent Management', icon: 'pi-shield', href: 'consent-management.html' }
      ]
    }
  ];

  const PAGE_HEADLINES = {
    activity: {
      title: 'App & Website Usage Analytics',
      subtitle: 'Where time is spent across applications and websites'
    },
    timeline: {
      title: 'Employee Day Timeline',
      subtitle: 'Minute-by-minute activity, idle gaps and app switches'
    },
    screenshots: {
      title: 'Automated Screenshot Audit Gallery',
      subtitle: 'Periodic captures with blur and privacy controls'
    },
    productivity: {
      title: 'Productivity Intelligence',
      subtitle: 'Scores, trends and unproductive time across teams'
    },
    timesheets: {
      title: 'Timesheet Idle & Net Hours Reconciliation',
      subtitle: 'Idle time, net hours and timesheet alignment'
    },
    employeeDetail: {
      title: 'Employee Detailed Profile & Audit',
      subtitle: 'Profile, activity history and monitoring audit'
    },
    rules: {
      title: 'Productivity Categorization Rules',
      subtitle: 'Classify apps and websites as productive or unproductive'
    },
    consent: {
      title: 'Employee Privacy Consent Directory',
      subtitle: 'Consent status, notices and audit trail'
    }
  };

  function hexToRgb(hex) {
    const clean = String(hex || '').replace('#', '').trim();
    const full = clean.length === 3
      ? clean.split('').map((c) => c + c).join('')
      : clean;

    if (full.length !== 6) {
      return null;
    }

    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16)
    };
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map((n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0')).join('');
  }

  function mixHex(hex, target, amount) {
    const a = hexToRgb(hex);
    const b = hexToRgb(target);

    if (!a || !b) {
      return hex;
    }

    return rgbToHex(
      Math.round(a.r + (b.r - a.r) * amount),
      Math.round(a.g + (b.g - a.g) * amount),
      Math.round(a.b + (b.b - a.b) * amount)
    );
  }

  function luminance(hex) {
    const rgb = hexToRgb(hex);

    if (!rgb) {
      return 0;
    }

    return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  }

  function applyBrandColor(primary, secondary) {
    const root = document.documentElement;
    const tints = { 50: 0.92, 100: 0.84, 200: 0.68, 300: 0.52, 400: 0.36 };
    const shades = { 600: 0.12, 700: 0.24, 800: 0.38, 900: 0.52, 950: 0.66 };
    const contrast = luminance(primary) > 0.5 ? '#000000' : '#ffffff';

    root.style.setProperty('--primary-color', primary);
    root.style.setProperty('--primary-color-text', contrast);
    root.style.setProperty('--p-primary-color-text', contrast);
    root.style.setProperty('--p-primary-contrast-color', contrast);
    root.style.setProperty('--p-button-text-color', contrast);
    root.style.setProperty('--p-button-bg', primary);
    root.style.setProperty('--p-button-border', primary);

    Object.keys(tints).forEach((step) => {
      const value = mixHex(primary, '#ffffff', tints[step]);
      root.style.setProperty('--primary-' + step, value);
      root.style.setProperty('--p-primary-' + step, value);
    });

    root.style.setProperty('--primary-500', primary);
    root.style.setProperty('--p-primary-500', primary);
    root.style.setProperty('--p-highlight-background', primary);
    root.style.setProperty('--p-highlight-color', contrast);

    Object.keys(shades).forEach((step) => {
      const value = mixHex(primary, '#000000', shades[step]);
      root.style.setProperty('--primary-' + step, value);
      root.style.setProperty('--p-primary-' + step, value);
    });

    root.style.setProperty('--p-button-hover-bg', 'var(--primary-600)');
    root.style.setProperty('--p-button-hover-border', 'var(--primary-600)');
    root.style.setProperty('--p-button-active-bg', 'var(--primary-700)');
    root.style.setProperty('--p-button-active-border', 'var(--primary-700)');
    root.style.setProperty('--p-button-focus-shadow', '0 0 0 0.2rem var(--primary-200)');

    if (secondary) {
      root.style.setProperty('--brand-accent', secondary);
    }
  }

  function applyRuntimeConfig(cfg) {
    if (!cfg || typeof cfg !== 'object') {
      return;
    }

    if (cfg.primaryColor) {
      applyBrandColor(cfg.primaryColor, cfg.secondaryColor);
    }

    if (cfg.favicon) {
      let link = document.querySelector('link[rel="icon"]');

      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }

      link.href = cfg.favicon;
    }

    if (cfg.title || cfg.appTitle || cfg.companyName) {
      document.title = cfg.title || cfg.appTitle || cfg.companyName;
    }
  }

  function initDynamicBranding() {
    fetch('/api/v1/configs')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const cfg = data && (data.data || data.config || data);
        applyRuntimeConfig(cfg);
      })
      .catch(function () {
        /* optional API — keep default navy brand */
      });
  }

  function isDark() {
    return document.documentElement.classList.contains('app-dark');
  }

  function setDarkTheme(enabled) {
    document.documentElement.classList.toggle('app-dark', enabled);
    localStorage.setItem(DARK_KEY, enabled ? '1' : '0');
    LAYOUT_CONFIG.darkTheme = enabled;
    syncDarkToggleIcon();
  }

  function toggleDarkMode() {
    const next = !isDark();
    const apply = function () {
      setDarkTheme(next);
    };

    if (typeof document.startViewTransition === 'function') {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }

  function syncDarkToggleIcon() {
    const btn = document.getElementById('darkModeToggle');

    if (!btn) {
      return;
    }

    const icon = btn.querySelector('i');
    const dark = isDark();

    if (icon) {
      icon.className = dark ? 'pi pi-sun' : 'pi pi-moon';
    }

    btn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    btn.setAttribute('aria-label', btn.title);
  }

  function currentPageFile() {
    const file = (window.location.pathname.split('/').pop() || 'dashboard.html').split('?')[0];

    if (!file || file === 'index.html') {
      return 'dashboard.html';
    }

    return file;
  }

  function buildMenuHtml(active) {
    return MENU.map(function (section) {
      const items = section.items.map(function (item) {
        const cls = item.href === active ? ' class="active-route"' : '';
        return (
          '<li>' +
            '<a href="' + item.href + '"' + cls + '>' +
              '<i class="pi pi-fw ' + item.icon + ' layout-menuitem-icon"></i>' +
              '<span class="layout-menuitem-text">' + item.label + '</span>' +
            '</a>' +
          '</li>'
        );
      }).join('');

      return (
        '<li class="layout-root-menuitem">' +
          '<div class="layout-menuitem-root-text">' + section.label + '</div>' +
          '<ul>' + items + '</ul>' +
        '</li>'
      );
    }).join('');
  }

  function initDarkMode() {
    const saved = localStorage.getItem(DARK_KEY);
    const enabled = saved === '1' ? true : LAYOUT_CONFIG.darkTheme;
    setDarkTheme(enabled);

    const btn = document.getElementById('darkModeToggle');

    if (!btn || btn.dataset.bound === '1') {
      return;
    }

    btn.dataset.bound = '1';
    btn.addEventListener('click', toggleDarkMode);
    syncDarkToggleIcon();
  }

  function initLayoutChrome() {
    const layout = document.getElementById('appLayout');

    if (!layout || layout.classList.contains('layout-wrapper')) {
      return;
    }

    const pageContent = layout.querySelector('.page-content');
    const titleEl = layout.querySelector('.page-title');
    const page = document.body.dataset.page;
    const active = currentPageFile();
    const meta = PAGE_HEADLINES[page];
    const title = (meta && meta.title) || (titleEl && titleEl.textContent.trim()) || '';
    const subtitle = meta && meta.subtitle;
    const skipHeadline = page === 'dashboard' || (pageContent && pageContent.querySelector('.page-headline'));

    const topbar = document.createElement('div');
    topbar.className = 'layout-topbar';
    topbar.innerHTML =
      '<div class="layout-topbar-logo-container">' +
        '<button type="button" class="layout-menu-button layout-topbar-action" id="sidebarToggle" title="Toggle menu" aria-label="Toggle menu">' +
          '<i class="pi pi-bars"></i>' +
        '</button>' +
        '<a class="layout-topbar-logo" href="dashboard.html">' +
          '<span class="brand-mark">O</span>' +
          '<span class="brand-title">OBELISK</span>' +
        '</a>' +
      '</div>' +
      '<div class="layout-topbar-actions">' +
        '<div class="entity-selector">' +
          '<select class="form-control" aria-label="Select entity"></select>' +
        '</div>' +
        '<div class="layout-config-menu">' +
          '<button type="button" class="layout-topbar-action" id="darkModeToggle" title="Switch to dark mode" aria-label="Switch to dark mode">' +
            '<i class="pi pi-moon"></i>' +
          '</button>' +
        '</div>' +
        '<div class="layout-topbar-menu">' +
          '<div class="layout-topbar-menu-content">' +
            '<button type="button" class="layout-topbar-action" id="userMenuBtn" title="Profile" aria-label="Profile" aria-haspopup="true">' +
              '<i class="pi pi-user"></i>' +
            '</button>' +
            '<div class="user-menu" id="userMenu" hidden>' +
              '<div class="user-menu-header">' +
                '<div class="user-menu-name">Admin</div>' +
                '<div class="user-menu-role">System Admin</div>' +
              '</div>' +
              '<button type="button" class="user-menu-item" id="logoutBtn">' +
                '<i class="pi pi-sign-out"></i><span>Sign Out</span>' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    const sidebar = document.createElement('aside');
    sidebar.className = 'layout-sidebar';
    sidebar.id = 'sidebar';
    sidebar.innerHTML = '<ul class="layout-menu">' + buildMenuHtml(active) + '</ul>';

    const mainContainer = document.createElement('div');
    mainContainer.className = 'layout-main-container';

    const main = document.createElement('div');
    main.className = 'layout-main';

    if (!skipHeadline && title) {
      const headline = document.createElement('div');
      headline.className = 'page-headline';
      headline.innerHTML = '<h1>' + title + '</h1>' + (subtitle ? '<p>' + subtitle + '</p>' : '');
      main.appendChild(headline);
    }

    if (pageContent) {
      main.appendChild(pageContent);
    }

    const footer = document.createElement('div');
    footer.className = 'layout-footer';
    footer.innerHTML = 'Obelisk ERP by <a href="#">Obelisk Tech Ltd</a>';

    mainContainer.appendChild(main);
    mainContainer.appendChild(footer);

    const mask = document.createElement('div');
    mask.className = 'layout-mask';
    mask.id = 'layoutMask';

    layout.innerHTML = '';
    layout.className = 'layout-wrapper layout-static';
    layout.id = 'appLayout';
    layout.appendChild(topbar);
    layout.appendChild(sidebar);
    layout.appendChild(mainContainer);
    layout.appendChild(mask);

    if (localStorage.getItem('obelisk-sidebar-collapsed') === '1') {
      layout.classList.add('layout-static-inactive');
    }
  }

  function initSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    const layout = document.getElementById('appLayout');
    const mask = document.getElementById('layoutMask');

    if (!toggle || !layout) {
      return;
    }

    function closeMobile() {
      layout.classList.remove('layout-mobile-active');
      document.body.classList.remove('blocked-scroll');
    }

    toggle.addEventListener('click', function () {
      if (window.matchMedia('(max-width: 991px)').matches) {
        layout.classList.toggle('layout-mobile-active');
        document.body.classList.toggle('blocked-scroll', layout.classList.contains('layout-mobile-active'));
        return;
      }

      layout.classList.toggle('layout-static-inactive');
      localStorage.setItem(
        'obelisk-sidebar-collapsed',
        layout.classList.contains('layout-static-inactive') ? '1' : '0'
      );
    });

    if (mask) {
      mask.addEventListener('click', closeMobile);
    }

    window.addEventListener('resize', function () {
      if (!window.matchMedia('(max-width: 991px)').matches) {
        closeMobile();
      }
    });
  }

  function initUserMenu() {
    const btn = document.getElementById('userMenuBtn');
    const menu = document.getElementById('userMenu');

    if (!btn || !menu) {
      return;
    }

    btn.addEventListener('click', function (event) {
      event.stopPropagation();
      menu.hidden = !menu.hidden;
    });

    document.addEventListener('click', function (event) {
      if (!menu.hidden && !menu.contains(event.target) && event.target !== btn) {
        menu.hidden = true;
      }
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
      dateEl.textContent = formatDateDMY('2026-08-10');
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
    const username = localStorage.getItem('username') || 'admin';
    const display = username.charAt(0).toUpperCase() + username.slice(1);
    const initials = username.slice(0, 2).toUpperCase();
    const nameEl = document.querySelector('.user-menu-name');
    const welcomeName = document.querySelector('.dash-welcome-text h2');
    const welcomeAvatar = document.querySelector('.dash-welcome-avatar');

    if (nameEl) {
      nameEl.textContent = display;
    }

    if (welcomeName) {
      welcomeName.textContent = 'Good Afternoon, ' + display + '!';
    }

    if (welcomeAvatar) {
      welcomeAvatar.textContent = initials;
    }
  }

  function initLogout() {
    const btn = document.getElementById('logoutBtn');

    if (!btn || btn.dataset.bound === '1') {
      return;
    }

    btn.dataset.bound = '1';
    btn.addEventListener('click', function () {
      TS().logout();
      window.location.href = 'login.html';
    });
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function formatDateDMY(value) {
    if (value == null || value === '') {
      return '';
    }

    if (value instanceof Date && !isNaN(value.getTime())) {
      return pad2(value.getDate()) + '/' + pad2(value.getMonth() + 1) + '/' + value.getFullYear();
    }

    const iso = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (iso) {
      return iso[3] + '/' + iso[2] + '/' + iso[1];
    }

    return String(value);
  }

  function formatDateRange(start, end) {
    return formatDateDMY(start) + ' - ' + formatDateDMY(end);
  }

  function rangeForPeriod(period) {
    const ranges = {
      today: ['2026-08-10', '2026-08-10'],
      yesterday: ['2026-08-09', '2026-08-09'],
      week: ['2026-08-04', '2026-08-10'],
      last7: ['2026-08-04', '2026-08-10'],
      month: ['2026-08-01', '2026-08-31']
    };

    return ranges[period] || ranges.month;
  }

  function upgradeDateFilters(bar) {
    bar.querySelectorAll('.filter-group').forEach(function (group) {
      const label = group.querySelector('.filter-label');
      const labelText = label ? label.textContent.replace(/:$/, '').trim().toLowerCase() : '';
      const dateInput = group.querySelector('input[type="date"]');
      const select = group.querySelector('select');
      const isRange = /date range|reporting period/.test(labelText);

      if (dateInput && !isRange) {
        const display = document.createElement('input');
        display.type = 'text';
        display.className = 'form-control js-date-display';
        display.readOnly = true;
        display.value = formatDateDMY(dateInput.value || '2026-08-10');
        dateInput.replaceWith(display);
        return;
      }

      if (!isRange && !(dateInput && /range/i.test(labelText))) {
        return;
      }

      if (label) {
        label.textContent = 'Reporting period';
      }

      let period = select;

      if (!period) {
        period = document.createElement('select');
        period.className = 'form-control js-date-period';
        period.innerHTML =
          '<option value="today">Today</option>' +
          '<option value="yesterday">Yesterday</option>' +
          '<option value="week">This Week</option>' +
          '<option value="month" selected>This Month</option>';

        if (dateInput) {
          dateInput.replaceWith(period);
        } else {
          group.appendChild(period);
        }
      } else {
        period.classList.add('js-date-period');
        period.innerHTML =
          '<option value="today">Today</option>' +
          '<option value="yesterday">Yesterday</option>' +
          '<option value="week">This Week</option>' +
          '<option value="last7">Last 7 Days</option>' +
          '<option value="month" selected>This Month</option>';
      }

      if (group.parentElement && group.parentElement.querySelector('.js-date-range')) {
        return;
      }

      const applied = document.createElement('div');
      applied.className = 'filter-group';
      applied.innerHTML =
        '<span class="filter-label">Applied range</span>' +
        '<input type="text" class="form-control js-date-range" readonly value="' +
        formatDateRange(rangeForPeriod(period.value)[0], rangeForPeriod(period.value)[1]) +
        '">';

      group.after(applied);

      period.addEventListener('change', function () {
        const range = rangeForPeriod(period.value);
        const input = applied.querySelector('.js-date-range');

        if (input) {
          input.value = formatDateRange(range[0], range[1]);
        }
      });
    });
  }

  function wrapFilterControl(control, iconClass) {
    if (!control || !control.parentElement || control.parentElement.classList.contains('filter-input-wrap')) {
      return;
    }

    const wrap = document.createElement('div');
    wrap.className = 'filter-input-wrap';
    control.parentNode.insertBefore(wrap, control);
    wrap.appendChild(control);

    const icon = document.createElement('i');
    icon.className = 'pi ' + iconClass + ' filter-chevron';
    wrap.appendChild(icon);
  }

  function initFilterChrome() {
    document.querySelectorAll('.filter-bar').forEach(function (bar) {
      if (bar.classList.contains('filter-card')) {
        return;
      }

      bar.classList.add('filter-card');
      upgradeDateFilters(bar);

      const title = document.createElement('h2');
      title.className = 'filter-title';
      title.textContent = 'Filters';
      bar.insertBefore(title, bar.firstChild);

      const fields = document.createElement('div');
      fields.className = 'filter-fields';

      bar.querySelectorAll(':scope > .filter-group').forEach(function (group) {
        const label = group.querySelector('.filter-label');

        if (label) {
          label.textContent = label.textContent.replace(/:$/, '').trim();
        }

        if (group.querySelector('input[type="checkbox"]')) {
          group.classList.add('filter-group-check');
        }

        wrapFilterControl(group.querySelector('select'), 'pi-chevron-down');
        wrapFilterControl(group.querySelector('input[type="date"]'), 'pi-calendar');

        const dateText = group.querySelector('.js-date-range, .js-date-display');

        if (dateText) {
          wrapFilterControl(dateText, 'pi-calendar');
        } else {
          wrapFilterControl(group.querySelector('input[type="text"], input[type="search"]'), 'pi-search');
        }

        const control = group.querySelector('.form-control');

        if (control) {
          control.style.width = '100%';
        }

        fields.appendChild(group);
      });

      title.after(fields);

      const actions = document.createElement('div');
      actions.className = 'filter-actions';

      Array.from(bar.children).forEach(function (child) {
        if (child === title || child === fields || child === actions) {
          return;
        }

        if (child.classList.contains('filter-group') || child.classList.contains('filter-fields')) {
          return;
        }

        actions.appendChild(child);
      });

      Array.from(actions.querySelectorAll('.btn')).forEach(function (btn) {
        btn.classList.remove('btn-sm');

        if (/reset|clear/i.test(btn.textContent)) {
          btn.className = 'btn btn-outlined';
          btn.innerHTML = '<i class="pi pi-filter-slash"></i> Clear filters';
        }
      });

      if (!/clear filters/i.test(actions.textContent)) {
        const clear = document.createElement('button');
        clear.type = 'button';
        clear.className = 'btn btn-outlined';
        clear.innerHTML = '<i class="pi pi-filter-slash"></i> Clear filters';
        actions.insertBefore(clear, actions.firstChild);
      }

      const clearBtn = Array.from(actions.querySelectorAll('button, .btn')).find(function (b) {
        return /clear filters/i.test(b.textContent);
      });

      if (clearBtn) {
        clearBtn.addEventListener('click', function (event) {
          event.preventDefault();
          bar.querySelectorAll('select').forEach(function (select) {
            select.selectedIndex = 0;
          });
          bar.querySelectorAll('input[type="text"], input[type="search"]').forEach(function (input) {
            input.value = '';
          });
          bar.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
            input.checked = false;
          });
          bar.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }

      if (!actions.querySelector('.btn-primary')) {
        const apply = document.createElement('button');
        apply.type = 'button';
        apply.className = 'btn btn-primary';
        apply.innerHTML = '<i class="pi pi-search"></i> Apply filters';
        actions.appendChild(apply);
      } else {
        Array.from(actions.querySelectorAll('.btn-primary')).forEach(function (btn) {
          if (!btn.querySelector('.pi')) {
            btn.insertAdjacentHTML('afterbegin', '<i class="pi pi-search"></i> ');
          }
        });
      }

      bar.appendChild(actions);
    });
  }

  function actionMenuHtml(items) {
    const rows = (items || [])
      .map(function (item) {
        const icon = item.icon ? '<i class="pi ' + item.icon + '"></i>' : '';

        if (item.onclick) {
          return '<li><button type="button" role="menuitem" onclick="' + item.onclick + '">' + icon + item.label + '</button></li>';
        }

        return '<li><a href="' + item.href + '" role="menuitem">' + icon + item.label + '</a></li>';
      })
      .join('');

    return (
      '<div class="action-menu">' +
        '<button type="button" class="action-menu-btn" aria-label="Actions" aria-haspopup="true">' +
          '<i class="pi pi-ellipsis-v"></i>' +
        '</button>' +
        '<ul class="action-menu-list" role="menu">' + rows + '</ul>' +
      '</div>'
    );
  }

  function initActionMenus() {
    if (document.documentElement.dataset.actionMenus === '1') {
      return;
    }

    document.documentElement.dataset.actionMenus = '1';

    function closeAllMenus(except) {
      document.querySelectorAll('.action-menu.open').forEach(function (openMenu) {
        if (openMenu !== except) {
          openMenu.classList.remove('open');
        }
      });
    }

    function positionMenu(menu) {
      const button = menu.querySelector('.action-menu-btn');
      const list = menu.querySelector('.action-menu-list');

      if (!button || !list) {
        return;
      }

      const rect = button.getBoundingClientRect();
      list.style.position = 'fixed';
      list.style.top = rect.bottom + 4 + 'px';
      list.style.right = Math.max(8, window.innerWidth - rect.right) + 'px';
      list.style.left = 'auto';
      list.style.zIndex = '1100';
    }

    document.addEventListener('click', function (event) {
      const button = event.target.closest('.action-menu-btn');
      const menu = event.target.closest('.action-menu');

      if (button) {
        event.preventDefault();
        event.stopPropagation();
        const willOpen = !menu.classList.contains('open');
        closeAllMenus();

        if (willOpen) {
          menu.classList.add('open');
          positionMenu(menu);
        }

        return;
      }

      if (!menu) {
        closeAllMenus();
      }
    });

    window.addEventListener('scroll', function () {
      closeAllMenus();
    }, true);
  }

  function pageWindow(current, total) {
    const pages = [];
    const windowSize = 5;
    let start = Math.max(0, current - Math.floor(windowSize / 2));
    let end = Math.min(total - 1, start + windowSize - 1);
    start = Math.max(0, end - windowSize + 1);

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    return pages;
  }

  function visibleTableRows(table) {
    return Array.from(table.tBodies[0] ? table.tBodies[0].rows : []).filter(function (row) {
      return !row.classList.contains('filter-out');
    });
  }

  function refreshPaginator(table) {
    if (!table || !table._paginator) {
      return;
    }

    const state = table._paginator;
    const rows = visibleTableRows(table);
    const total = rows.length;
    const pageCount = Math.max(1, Math.ceil((total || 1) / state.rows));

    if (state.page > pageCount - 1) {
      state.page = pageCount - 1;
    }

    if (state.page < 0) {
      state.page = 0;
    }

    Array.from(table.tBodies[0].rows).forEach(function (row) {
      row.style.display = 'none';
    });

    const start = state.page * state.rows;
    rows.slice(start, start + state.rows).forEach(function (row) {
      row.style.display = '';
    });

    const first = total === 0 ? 0 : start + 1;
    const last = Math.min(total, start + state.rows);
    const host = table._paginatorHost;

    if (!host) {
      return;
    }

    host.querySelector('.p-paginator-current').textContent =
      'Showing ' + first + ' to ' + last + ' of ' + total + ' entries';

    const atFirst = state.page === 0 || total === 0;
    const atLast = state.page >= pageCount - 1 || total === 0;
    host.querySelector('.p-paginator-first').disabled = atFirst;
    host.querySelector('.p-paginator-prev').disabled = atFirst;
    host.querySelector('.p-paginator-next').disabled = atLast;
    host.querySelector('.p-paginator-last').disabled = atLast;

    const pagesEl = host.querySelector('.p-paginator-pages');
    pagesEl.innerHTML = pageWindow(state.page, pageCount)
      .map(function (index) {
        const active = index === state.page ? ' p-highlight' : '';
        return '<button type="button" class="p-paginator-page' + active + '" data-page="' + index + '">' + (index + 1) + '</button>';
      })
      .join('');

    host.querySelector('.p-paginator-rpp select').value = String(state.rows);
  }

  function bindPaginator(table) {
    if (!table || !table.tBodies[0]) {
      return;
    }

    if (table.dataset.noPaginator === 'true' || table.closest('.dash-hidden-table')) {
      return;
    }

    if (!table._paginator) {
      table._paginator = { page: 0, rows: 50 };
    }

    if (!table._paginatorHost) {
      const host = document.createElement('div');
      host.className = 'p-paginator';
      host.innerHTML =
        '<span class="p-paginator-current"></span>' +
        '<div class="p-paginator-nav">' +
          '<button type="button" class="p-paginator-first" aria-label="First page"><i class="pi pi-angle-double-left"></i></button>' +
          '<button type="button" class="p-paginator-prev" aria-label="Previous page"><i class="pi pi-angle-left"></i></button>' +
          '<span class="p-paginator-pages"></span>' +
          '<button type="button" class="p-paginator-next" aria-label="Next page"><i class="pi pi-angle-right"></i></button>' +
          '<button type="button" class="p-paginator-last" aria-label="Last page"><i class="pi pi-angle-double-right"></i></button>' +
        '</div>' +
        '<div class="p-paginator-rpp">' +
          '<select aria-label="Rows per page">' +
            '<option value="10">10</option>' +
            '<option value="20">20</option>' +
            '<option value="50" selected>50</option>' +
          '</select>' +
          '<i class="pi pi-chevron-down"></i>' +
        '</div>';

      const wrap = table.closest('.table-responsive') || table;
      wrap.after(host);
      table._paginatorHost = host;

      host.querySelector('.p-paginator-first').addEventListener('click', function () {
        table._paginator.page = 0;
        refreshPaginator(table);
      });
      host.querySelector('.p-paginator-prev').addEventListener('click', function () {
        table._paginator.page -= 1;
        refreshPaginator(table);
      });
      host.querySelector('.p-paginator-next').addEventListener('click', function () {
        table._paginator.page += 1;
        refreshPaginator(table);
      });
      host.querySelector('.p-paginator-last').addEventListener('click', function () {
        const total = visibleTableRows(table).length;
        table._paginator.page = Math.max(0, Math.ceil(total / table._paginator.rows) - 1);
        refreshPaginator(table);
      });
      host.querySelector('.p-paginator-pages').addEventListener('click', function (event) {
        const btn = event.target.closest('.p-paginator-page');

        if (!btn) {
          return;
        }

        table._paginator.page = Number(btn.getAttribute('data-page'));
        refreshPaginator(table);
      });
      host.querySelector('.p-paginator-rpp select').addEventListener('change', function () {
        table._paginator.rows = Number(this.value);
        table._paginator.page = 0;
        refreshPaginator(table);
      });
    }

    refreshPaginator(table);
  }

  function initPaginators() {
    document.querySelectorAll('table.table').forEach(bindPaginator);
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
    initLayoutChrome();
    initDarkMode();
    initDynamicBranding();
    initSidebar();
    initUserMenu();
    initUserProfile();
    initLogout();
    initEntitySelector();
    initHeaderDate();
    initHeaderSync();
    initFilterChrome();
    initActionMenus();
  }

  global.ObeliskApp = {
    initCommon,
    initSidebar,
    initEntitySelector,
    initHeaderSync,
    toggleDarkMode,
    applyBrandColor,
    actionMenuHtml,
    initPaginators,
    refreshPaginator,
    formatDateDMY,
    formatDateRange,
    layoutConfig: LAYOUT_CONFIG
  };
})(window);
