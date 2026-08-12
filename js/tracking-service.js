/**
 * TrackingService — mirrors Angular src service workflow:
 * - Entity scoping via localStorage activeEntityId (auth.interceptor pattern)
 * - API envelope { status, message, data }
 * - Server-side category re-derivation on ingest (§1.3)
 * - Productivity score, net hours, screenshot↔segment join (§3.3)
 */
(function (global) {
  const DATA = () => global.ObeliskStaticData;

  function success(data, message) {
    return { status: 'success', message: message || 'OK', data };
  }

  function getActiveEntityId() {
    const stored = localStorage.getItem('activeEntityId');

    return stored ? Number(stored) : 1;
  }

  function setActiveEntityId(entityId) {
    localStorage.setItem('activeEntityId', String(entityId));
  }

  const DEMO_CREDENTIALS = { username: 'admin', password: 'admin123' };

  function isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  function login(username, password, rememberMe) {
    const normalized = (username || '').trim().toLowerCase();

    if (normalized !== DEMO_CREDENTIALS.username || password !== DEMO_CREDENTIALS.password) {
      return { status: 'error', message: 'Invalid username or password. Please try again.' };
    }

    localStorage.setItem('token', 'static-demo-token');
    localStorage.setItem('username', DEMO_CREDENTIALS.username);

    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }

    if (!localStorage.getItem('activeEntityId')) {
      localStorage.setItem('activeEntityId', '1');
    }

    return success({ username: DEMO_CREDENTIALS.username }, 'Login successful');
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('rememberMe');
  }

  function initAuthContext() {
    if (!localStorage.getItem('activeEntityId')) {
      localStorage.setItem('activeEntityId', '1');
    }
  }

  function getEntityName(entityId) {
    const entity = DATA().ENTITIES.find((e) => e.id === entityId);

    return entity ? entity.name : 'Unknown Entity';
  }

  function getEmployeesByEntity(entityId) {
    return DATA().EMPLOYEES.filter((e) => e.entityId === entityId);
  }

  /** §1.1 GET /tracking/settings */
  function getTrackingSettings(entityId) {
    const id = entityId || getActiveEntityId();
    const settings = DATA().TRACKING_SETTINGS[id];

    if (!settings) {
      return { status: 'error', message: 'Tracking policy not found', statusCode: 404 };
    }

    const consentRecords = DATA().USER_CONSENT.filter((c) => c.entityId === id && !c.revokedAt && c.consentedAt);

    return success(
      {
        ...settings,
        consentOnFile: consentRecords.length > 0
      },
      'Tracking settings loaded'
    );
  }

  /** §1.6 PUT /tracking/settings (static in-memory update) */
  function updateTrackingSettings(entityId, payload) {
    const id = entityId || getActiveEntityId();

    if (!DATA().TRACKING_SETTINGS[id]) {
      return { status: 'error', message: 'Entity not found', statusCode: 404 };
    }

    DATA().TRACKING_SETTINGS[id] = { ...DATA().TRACKING_SETTINGS[id], ...payload };

    return success(DATA().TRACKING_SETTINGS[id], 'Settings saved and will deploy to desktop agents');
  }

  /** §3.1 classification rules — blacklist beats whitelist; domains before apps */
  function classifySegment(segment, rules) {
    if (segment.kind === 'idle') {
      return 'neutral';
    }

    const domain = (segment.domain || '').toLowerCase().trim();
    const appName = (segment.appName || '').toLowerCase().trim();
    const appTitle = (segment.appTitle || '').toLowerCase();

    if (domain) {
      for (const pattern of rules.unproductiveDomains || []) {
        if (domainMatches(domain, pattern)) {
          return 'unproductive';
        }
      }

      for (const pattern of rules.productiveDomains || []) {
        if (domainMatches(domain, pattern)) {
          return 'productive';
        }
      }
    }

    for (const pattern of rules.unproductiveApps || []) {
      if (appMatches(appName, appTitle, pattern)) {
        return 'unproductive';
      }
    }

    for (const pattern of rules.productiveApps || []) {
      if (appMatches(appName, appTitle, pattern)) {
        return 'productive';
      }
    }

    return rules.defaultCategory || 'neutral';
  }

  function domainMatches(host, pattern) {
    const p = pattern.toLowerCase();

    return host === p || host.endsWith('.' + p);
  }

  function appMatches(appName, appTitle, pattern) {
    const p = pattern.toLowerCase();

    return appName === p || appName.includes(p.replace('.exe', '')) || appTitle.includes(p.replace('.exe', ''));
  }

  /** Re-derive categories for all segments (§1.6 re-classification job simulation) */
  function reclassifySegments(entityId) {
    const settings = getTrackingSettings(entityId).data;

    if (!settings) {
      return;
    }

    DATA().ACTIVITY_SEGMENTS.forEach((seg) => {
      if (seg.entityId === entityId && seg.kind === 'active') {
        seg.category = classifySegment(seg, settings.rules);
      }
    });
  }

  function parseIso(iso) {
    return new Date(iso);
  }

  function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      return `${h}h ${m}m`;
    }

    if (m > 0) {
      return `${m}m ${s}s`;
    }

    return `${s}s`;
  }

  function formatDurationShort(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    if (h > 0) {
      return `${h}H ${String(m).padStart(2, '0')}M`;
    }

    return `${m}M`;
  }

  function formatDomain(domain) {
    if (!domain || !domain.trim()) {
      return '—';
    }

    return domain;
  }

  function formatCategoryLabel(category) {
    if (!category) {
      return 'Neutral';
    }

    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  function categoryBadgeClass(category) {
    const map = {
      productive: 'badge-productive',
      unproductive: 'badge-unproductive',
      neutral: 'badge-neutral',
      idle: 'badge-idle'
    };

    return map[category] || 'badge-neutral';
  }

  function timelineBlockClass(segment) {
    if (segment.kind === 'idle') {
      return 'block-idle';
    }

    const map = {
      productive: 'block-productive',
      unproductive: 'block-unproductive',
      neutral: 'block-neutral'
    };

    return map[segment.category] || 'block-neutral';
  }

  /** §3.3 productivity score — idle excluded from denominator */
  function computeProductivityScore(segments) {
    let productive = 0;
    let unproductive = 0;
    let neutral = 0;
    let idle = 0;

    segments.forEach((seg) => {
      if (seg.kind === 'idle') {
        idle += seg.seconds;

        return;
      }

      if (seg.category === 'productive') {
        productive += seg.seconds;
      } else if (seg.category === 'unproductive') {
        unproductive += seg.seconds;
      } else {
        neutral += seg.seconds;
      }
    });

    const denominator = productive + unproductive + neutral;
    const score = denominator > 0 ? Math.round((productive / denominator) * 100) : 0;

    return { productive, unproductive, neutral, idle, score, activeTotal: denominator };
  }

  /** §1.2 net hours = gross - idleSeconds/3600 unless idleCountsAsWork */
  function computeNetHours(hoursWorked, idleSeconds, idleCountsAsWork) {
    if (idleCountsAsWork || idleSeconds == null) {
      return hoursWorked;
    }

    return Math.max(0, hoursWorked - idleSeconds / 3600);
  }

  function getLastSyncedLabel(receivedAtIso) {
    if (!receivedAtIso) {
      return 'Never synced';
    }

    const received = parseIso(receivedAtIso);
    const now = new Date('2026-08-10T16:45:00+05:30');
    const diffMs = now - received;
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) {
      return 'Just now';
    }

    if (diffMin < 60) {
      return `${diffMin} min ago`;
    }

    const diffH = Math.floor(diffMin / 60);

    return `${diffH} hrs ago`;
  }

  /** §3.3 join screenshot to segment by (userId, capturedAt within segment range) */
  function joinScreenshotToSegment(screenshot, segments) {
    const captured = parseIso(screenshot.capturedAt);
    const userSegments = segments.filter((s) => s.userId === screenshot.userId);

    const match = userSegments.find((seg) => {
      const start = parseIso(seg.startedAt);
      const end = parseIso(seg.endedAt);

      return captured >= start && captured <= end;
    });

    return {
      appName: match ? match.appName || '—' : '—',
      appTitle: match ? match.appTitle || '—' : '—',
      domain: match ? formatDomain(match.domain) : '—'
    };
  }

  function getDayTimeline(userId, workDate, entityId) {
    return DATA()
      .ACTIVITY_SEGMENTS.filter((s) => s.userId === userId && s.startedAt.startsWith(workDate) && s.entityId === (entityId || getActiveEntityId()))
      .sort((a, b) => parseIso(a.startedAt) - parseIso(b.startedAt));
  }

  function getScreenshotsForDay(userId, workDate, entityId) {
    return DATA()
      .SCREENSHOTS.filter((s) => s.userId === userId && s.capturedAt.startsWith(workDate) && s.entityId === (entityId || getActiveEntityId()))
      .sort((a, b) => parseIso(a.capturedAt) - parseIso(b.capturedAt));
  }

  function getTimesheets(entityId, filters) {
    let rows = DATA().TIMESHEETS.filter((t) => t.entityId === (entityId || getActiveEntityId()));

    if (filters && filters.userId) {
      rows = rows.filter((t) => t.userId === filters.userId);
    }

    if (filters && filters.workDate) {
      rows = rows.filter((t) => t.workDate === filters.workDate);
    }

    return rows;
  }

  function getAppBreakdown(segments) {
    const active = segments.filter((s) => s.kind === 'active' && s.appName);
    const map = {};
    let total = 0;

    active.forEach((seg) => {
      const key = seg.appName;

      if (!map[key]) {
        map[key] = { appName: key, seconds: 0, switches: 0, category: seg.category };
      }

      map[key].seconds += seg.seconds;
      map[key].switches += 1;
      total += seg.seconds;
    });

    return Object.values(map)
      .sort((a, b) => b.seconds - a.seconds)
      .map((row) => ({
        ...row,
        sharePct: total > 0 ? Math.round((row.seconds / total) * 100) : 0
      }));
  }

  function getDomainBreakdown(segments) {
    const active = segments.filter((s) => s.kind === 'active' && s.domain);
    const map = {};
    let total = 0;

    active.forEach((seg) => {
      const key = seg.domain;

      if (!map[key]) {
        map[key] = { domain: key, seconds: 0, visits: 0, category: seg.category };
      }

      map[key].seconds += seg.seconds;
      map[key].visits += 1;
      total += seg.seconds;
    });

    return Object.values(map)
      .sort((a, b) => b.seconds - a.seconds)
      .map((row) => ({
        ...row,
        sharePct: total > 0 ? Math.round((row.seconds / total) * 100) : 0
      }));
  }

  function getDashboardRows(entityId) {
    const employees = getEmployeesByEntity(entityId || getActiveEntityId());
    const workDate = '2026-08-10';

    return employees.map((emp) => {
      const segments = getDayTimeline(emp.id, workDate, entityId);
      const stats = computeProductivityScore(segments);
      const shots = getScreenshotsForDay(emp.id, workDate, entityId);

      return {
        employee: emp,
        activeSeconds: stats.activeTotal,
        idleSeconds: stats.idle,
        productivityScore: stats.score,
        screenshotCount: shots.length,
        lastSynced: getLastSyncedLabel(emp.lastReceivedAt)
      };
    });
  }

  function getConsentRows(entityId) {
    const employees = DATA().EMPLOYEES.filter((e) => !entityId || e.entityId === entityId);

    return employees.map((emp) => {
      const consent = DATA().USER_CONSENT.find((c) => c.userId === emp.id && c.entityId === emp.entityId);
      let status = 'Pending';

      if (consent && consent.revokedAt) {
        status = 'Revoked';
      } else if (consent && consent.consentedAt) {
        status = 'Consented';
      }

      return {
        employee: emp,
        entityName: getEntityName(emp.entityId),
        status,
        consentedAt: consent && consent.consentedAt ? consent.consentedAt.slice(0, 10) : '—',
        consentVersion: consent ? consent.consentVersion : 'v1.0',
        revokedAt: consent && consent.revokedAt ? consent.revokedAt.slice(0, 10) : '—'
      };
    });
  }

  function clampSettingsInput(field, value) {
    const clamps = {
      idleTimeoutSeconds: [60, 14400],
      screenshotsPerHour: [1, 30],
      screenshotQuality: [20, 95],
      activitySampleSeconds: [2, 300]
    };

    if (!clamps[field]) {
      return value;
    }

    const [min, max] = clamps[field];

    return Math.min(max, Math.max(min, Number(value) || min));
  }

  global.TrackingService = {
    initAuthContext,
    isAuthenticated,
    login,
    logout,
    getActiveEntityId,
    setActiveEntityId,
    getEntityName,
    getEmployeesByEntity,
    getTrackingSettings,
    updateTrackingSettings,
    classifySegment,
    reclassifySegments,
    parseIso,
    formatDuration,
    formatDurationShort,
    formatDomain,
    formatCategoryLabel,
    categoryBadgeClass,
    timelineBlockClass,
    computeProductivityScore,
    computeNetHours,
    getLastSyncedLabel,
    joinScreenshotToSegment,
    getDayTimeline,
    getScreenshotsForDay,
    getTimesheets,
    getAppBreakdown,
    getDomainBreakdown,
    getDashboardRows,
    getConsentRows,
    clampSettingsInput,
    success
  };
})(window);
