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

  function initCommon() {
    TS().initAuthContext();
    TS().reclassifySegments(TS().getActiveEntityId());
    initSidebar();
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
