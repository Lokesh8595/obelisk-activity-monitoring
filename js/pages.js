/**
 * Page renderers — bind static data to existing HTML containers (no layout changes).
 */
(function (global) {
  const TS = () => global.TrackingService;
  const DATA = () => global.ObeliskStaticData;
  const WORK_DATE = '2026-08-10';
  const DAY_START = 9;
  const DAY_END = 17;

  function reloadCurrentPage() {
    const page = document.body.dataset.page;

    if (page && global.ObeliskPages[page]) {
      global.ObeliskPages[page]();
    }

    global.ObeliskApp.initHeaderSync();
  }

  function timeFromIso(iso) {
    const d = TS().parseIso(iso);

    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  function timelinePercent(iso) {
    const d = TS().parseIso(iso);
    const hours = d.getHours() + d.getMinutes() / 60;
    const span = DAY_END - DAY_START;

    return ((hours - DAY_START) / span) * 100;
  }

  function segmentWidthPercent(seg) {
    const span = (DAY_END - DAY_START) * 3600;

    return (seg.seconds / span) * 100;
  }

  function statusBadge(status) {
    const map = {
      active: 'badge-active',
      idle: 'badge-idle',
      offline: 'badge-offline'
    };
    const label = status.charAt(0).toUpperCase() + status.slice(1);

    return `<span class="badge ${map[status] || 'badge-neutral'}">${label}</span>`;
  }

  function progressClass(score) {
    if (score >= 80) {
      return 'progress-high';
    }

    if (score >= 60) {
      return 'progress-medium';
    }

    return 'progress-low';
  }

  /* ── Dashboard ── */
  function renderDashboard() {
    const entityId = TS().getActiveEntityId();
    const rows = TS().getDashboardRows(entityId);
    const tbody = document.querySelector('#empTable tbody');

    if (!tbody) {
      return;
    }

    tbody.innerHTML = rows
      .map((row) => {
        const e = row.employee;

        return `<tr>
          <td>
            <div class="emp-cell">
              <div class="emp-avatar" style="${e.avatarStyle}">${e.initials}</div>
              <div class="emp-details">
                <span class="emp-name">${e.name}</span>
                <span class="emp-email">${e.email}</span>
              </div>
            </div>
          </td>
          <td>${e.team}</td>
          <td>${e.project}</td>
          <td>${statusBadge(e.status)}</td>
          <td>${TS().formatDurationShort(row.activeSeconds + row.idleSeconds)}</td>
          <td>${TS().formatDurationShort(row.idleSeconds)}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div class="progress-bar-container" style="width: 80px;">
                <div class="progress-bar-fill ${progressClass(row.productivityScore)}" style="width: ${row.productivityScore}%;"></div>
              </div>
              <span style="font-weight: 600;">${row.productivityScore}%</span>
            </div>
          </td>
          <td>${row.screenshotCount}</td>
          <td${e.status === 'offline' ? ' title="Laptop appears offline"' : ''}>${row.lastSynced}</td>
          <td style="text-align: right;">
            <a href="employee-detail.html?userId=${e.id}" class="btn btn-outline btn-sm">View</a>
            <a href="employee-timeline.html?userId=${e.id}" class="btn btn-secondary btn-sm">Timeline</a>
            <a href="screenshots.html?userId=${e.id}" class="btn btn-secondary btn-sm">Shots</a>
          </td>
        </tr>`;
      })
      .join('');

    const search = document.getElementById('tableSearch');

    if (search) {
      search.onkeyup = function () {
        const term = this.value.toLowerCase();
        tbody.querySelectorAll('tr').forEach((row) => {
          row.style.display = row.innerText.toLowerCase().includes(term) ? '' : 'none';
        });
      };
    }
  }

  /* ── Employee Timeline §3.3 ── */
  function renderEmployeeTimeline() {
    const params = new URLSearchParams(window.location.search);
    const userId = Number(params.get('userId')) || 412;
    const entityId = TS().getActiveEntityId();
    const employee = DATA().EMPLOYEES.find((e) => e.id === userId) || DATA().EMPLOYEES[0];
    const segments = TS().getDayTimeline(employee.id, WORK_DATE, entityId);
    const screenshots = TS().getScreenshotsForDay(employee.id, WORK_DATE, entityId);
    const stats = TS().computeProductivityScore(segments);

    const empSelect = document.querySelector('.filter-bar select');

    if (empSelect) {
      const employees = TS().getEmployeesByEntity(entityId);
      empSelect.innerHTML = employees.map((e) => `<option value="${e.id}"${e.id === employee.id ? ' selected' : ''}>${e.name} (${e.team})</option>`).join('');
      empSelect.onchange = function () {
        window.location.href = `employee-timeline.html?userId=${this.value}`;
      };
    }

    const avatar = document.querySelector('.timeline-emp-info .emp-avatar');

    if (avatar) {
      avatar.textContent = employee.initials;
      avatar.style.cssText = employee.avatarStyle || '';
    }

    const nameEl = document.querySelector('.timeline-emp-info h2');

    if (nameEl) {
      nameEl.textContent = employee.name;
    }

    const metaEl = document.querySelector('.timeline-emp-info div[style*="gap: 12px"]');

    if (metaEl) {
      metaEl.innerHTML = `<span>Team: <strong>${employee.team}</strong></span><span>•</span><span>Project: <strong>${employee.project}</strong></span><span>•</span><span>Status: <strong style="color: var(--productive-green);">${employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}</strong></span>`;
    }

    const scoreEl = document.querySelector('.timeline-header [style*="font-size: 22px"]');

    if (scoreEl) {
      scoreEl.textContent = `${stats.score}%`;
    }

    const activeEl = document.querySelector('.timeline-header [style*="Total Active"]')?.nextElementSibling;

    if (activeEl) {
      activeEl.textContent = TS().formatDurationShort(stats.activeTotal);
    }

    const idleEl = document.querySelector('.timeline-header [style*="Total Idle"]')?.nextElementSibling;

    if (idleEl) {
      idleEl.textContent = TS().formatDurationShort(stats.idle);
    }

    const track = document.getElementById('timelineTrack');

    if (track) {
      let html = '';

      segments.forEach((seg) => {
        const width = segmentWidthPercent(seg);
        const cat = seg.kind === 'idle' ? 'Idle' : TS().formatCategoryLabel(seg.category);

        html += `<div class="timeline-block ${TS().timelineBlockClass(seg)}" style="width: ${width}%;"
          data-app="${seg.appName || 'System Idle'}" data-window="${seg.appTitle}"
          data-domain="${TS().formatDomain(seg.domain)}" data-start="${timeFromIso(seg.startedAt)}"
          data-end="${timeFromIso(seg.endedAt)}" data-duration="${TS().formatDuration(seg.seconds)}"
          data-cat="${cat}"></div>`;
      });

      screenshots.forEach((shot) => {
        const left = timelinePercent(shot.capturedAt);

        html += `<div class="screenshot-marker" style="left: ${left}%;" title="Screenshot at ${timeFromIso(shot.capturedAt)}"></div>`;
      });

      track.innerHTML = html;

      track.querySelectorAll('.timeline-block').forEach((block) => {
        block.addEventListener('click', function () {
          document.getElementById('cardApp').innerText = this.dataset.app;
          document.getElementById('cardWindow').innerText = this.dataset.window;
          document.getElementById('cardDomain').innerText = this.dataset.domain;
          document.getElementById('cardInterval').innerText = `${this.dataset.start} - ${this.dataset.end}`;
          document.getElementById('cardDuration').innerText = this.dataset.duration;
          const catElem = document.getElementById('cardCat');
          catElem.innerText = this.dataset.cat;
          catElem.className =
            'badge ' +
            (this.dataset.cat === 'Productive'
              ? 'badge-productive'
              : this.dataset.cat === 'Idle'
                ? 'badge-idle'
                : this.dataset.cat === 'Unproductive'
                  ? 'badge-unproductive'
                  : 'badge-neutral');
        });
      });
    }

    const logBody = document.querySelector('.timeline-card + .card tbody');

    if (logBody) {
      logBody.innerHTML = segments
        .map((seg) => {
          const cat = seg.kind === 'idle' ? 'idle' : seg.category;
          const hasShot = screenshots.some((s) => {
            const t = TS().parseIso(s.capturedAt);

            return t >= TS().parseIso(seg.startedAt) && t <= TS().parseIso(seg.endedAt);
          });

          return `<tr>
            <td>${timeFromIso(seg.startedAt)} - ${timeFromIso(seg.endedAt)}</td>
            <td><strong>${seg.appName || 'System Idle'}</strong></td>
            <td>${seg.appTitle}</td>
            <td>${TS().formatDomain(seg.domain)}</td>
            <td>${TS().formatDuration(seg.seconds)}</td>
            <td><span class="badge ${TS().categoryBadgeClass(cat)}">${TS().formatCategoryLabel(cat)}</span></td>
            <td>${hasShot ? '<a href="screenshots.html?userId=' + employee.id + '" class="badge badge-synced">📷 View Shot</a>' : '-'}</td>
          </tr>`;
        })
        .join('');
    }
  }

  /* ── App & Web Activity §1.7 breakdown ── */
  function renderActivity() {
    const params = new URLSearchParams(window.location.search);
    const userId = Number(params.get('userId')) || 412;
    const entityId = TS().getActiveEntityId();
    const segments = TS().getDayTimeline(userId, WORK_DATE, entityId);
    const stats = TS().computeProductivityScore(segments);
    const apps = TS().getAppBreakdown(segments);
    const domains = TS().getDomainBreakdown(segments);

    const cards = document.querySelectorAll('.summary-grid .summary-value');

    if (cards.length >= 4) {
      cards[0].textContent = TS().formatDuration(stats.activeTotal);
      cards[1].textContent = TS().formatDuration(stats.productive);
      cards[2].textContent = TS().formatDuration(stats.unproductive);
      cards[3].textContent = TS().formatDuration(stats.neutral);
    }

    const appBody = document.querySelector('.card .table tbody');

    if (appBody && apps.length) {
      const table = appBody.closest('table');

      if (table && table.querySelector('th')?.textContent === 'Application') {
        appBody.innerHTML = apps
          .slice(0, 5)
          .map(
            (a) => `<tr>
            <td><div style="display:flex;align-items:center;gap:10px;font-weight:600;"><span>💻</span><span>${a.appName}</span></div></td>
            <td><span class="badge ${TS().categoryBadgeClass(a.category)}">${TS().formatCategoryLabel(a.category)}</span></td>
            <td><strong>${TS().formatDuration(a.seconds)}</strong></td>
            <td><div style="display:flex;align-items:center;gap:8px;"><div class="progress-bar-container" style="width:100px;"><div class="progress-bar-fill ${progressClass(a.sharePct)}" style="width:${a.sharePct}%;"></div></div><span>${a.sharePct}%</span></div></td>
            <td>${a.switches} switches</td>
          </tr>`
          )
          .join('');
      }
    }

    const allTables = document.querySelectorAll('.card .table tbody');
    const domainBody = allTables[1];

    if (domainBody) {
      domainBody.innerHTML = domains
        .map(
          (d) => `<tr>
          <td><div style="display:flex;align-items:center;gap:8px;font-weight:600;"><span style="color:var(--primary-600);">🌐</span><span>${d.domain}</span></div></td>
          <td><span class="badge ${TS().categoryBadgeClass(d.category)}">${TS().formatCategoryLabel(d.category)}</span></td>
          <td><strong>${TS().formatDuration(d.seconds)}</strong></td>
          <td>${d.visits} visits</td>
          <td><div style="display:flex;align-items:center;gap:8px;"><div class="progress-bar-container" style="width:100px;"><div class="progress-bar-fill ${progressClass(d.sharePct)}" style="width:${d.sharePct}%;"></div></div><span>${d.sharePct}%</span></div></td>
        </tr>`
        )
        .join('');
    }
  }

  /* ── Screenshots §3.3 — join segment by time ── */
  function renderScreenshots() {
    const params = new URLSearchParams(window.location.search);
    const filterUserId = params.get('userId') ? Number(params.get('userId')) : null;
    const entityId = TS().getActiveEntityId();
    const allSegments = DATA().ACTIVITY_SEGMENTS.filter((s) => s.entityId === entityId);
    let shots = DATA().SCREENSHOTS.filter((s) => s.entityId === entityId);

    if (filterUserId) {
      shots = shots.filter((s) => s.userId === filterUserId);
    }

    const container = document.getElementById('galleryContainer');

    if (!container) {
      return;
    }

    container.innerHTML = shots
      .map((shot) => {
        const emp = DATA().EMPLOYEES.find((e) => e.id === shot.userId);
        const joined = TS().joinScreenshotToSegment(shot, allSegments);
        const time = timeFromIso(shot.capturedAt);
        const idleTag = shot.duringIdle ? '<span class="idle-banner-tag">Captured during idle</span>' : '';
        const blurOverlay = shot.blurred
          ? '<div class="screenshot-blurred-overlay">🔒<span>Blurred by policy</span><span style="font-size:10px;opacity:0.8;">Sensitive Content Protection</span></div>'
          : '';

        return `<div class="screenshot-card" data-idle="${shot.duringIdle}" data-blurred="${shot.blurred}" data-user="${emp.name}">
          <div class="screenshot-thumb-wrapper">${idleTag}
            <div class="screenshot-mock-img"><div class="mock-window-bar"><span class="mock-dot mock-dot-red"></span><span class="mock-dot mock-dot-yellow"></span><span class="mock-dot mock-dot-green"></span><span style="margin-left:6px;color:#cbd5e1;">${joined.appName} - ${joined.appTitle}</span></div></div>${blurOverlay}
          </div>
          <div class="screenshot-card-body">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span class="screenshot-time">${time}</span>
              <span class="badge ${shot.duringIdle ? 'badge-idle' : 'badge-active'}">${shot.duringIdle ? 'Idle' : 'Active'}</span>
            </div>
            <div class="screenshot-app-info">${joined.appName}</div>
            <div class="screenshot-domain">${joined.domain}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Emp: ${emp.name}</div>
          </div>
        </div>`;
      })
      .join('');

    container.querySelectorAll('.screenshot-card').forEach((card, i) => {
      const shot = shots[i];
      const joined = TS().joinScreenshotToSegment(shot, allSegments);
      const emp = DATA().EMPLOYEES.find((e) => e.id === shot.userId);

      card.onclick = function () {
        openScreenshotModal(timeFromIso(shot.capturedAt), emp.name, joined.appName, joined.domain, shot.duringIdle, shot.blurred, joined.appTitle);
      };
    });

    const idleCheck = document.getElementById('idleOnly');
    const blurCheck = document.getElementById('blurredOnly');

    function applyFilters() {
      container.querySelectorAll('.screenshot-card').forEach((card) => {
        const showIdle = !idleCheck.checked || card.dataset.idle === 'true';
        const showBlur = !blurCheck.checked || card.dataset.blurred === 'true';

        card.style.display = showIdle && showBlur ? '' : 'none';
      });
    }

    if (idleCheck) {
      idleCheck.onchange = applyFilters;
    }

    if (blurCheck) {
      blurCheck.onchange = applyFilters;
    }
  }

  function openScreenshotModal(time, emp, app, domain, isIdle, isBlurred, title) {
    document.getElementById('mTitle').innerText = `Screenshot - ${app} (${time})`;
    document.getElementById('mTime').innerText = time;
    document.getElementById('mEmp').innerText = emp;
    document.getElementById('mApp').innerText = app;
    document.getElementById('mDomain').innerText = domain;
    document.getElementById('mWinBar').innerText = `${app} - ${title || domain}`;
    document.getElementById('mIdleTag').innerHTML = isIdle ? '<span class="badge badge-idle">Captured during idle</span>' : '<span class="badge badge-active">Active</span>';
    document.getElementById('mBlurTag').innerHTML = isBlurred ? '<span class="badge badge-unproductive">Blurred by policy</span>' : '<span class="badge badge-neutral">No</span>';
    document.getElementById('mBlurOverlay').style.display = isBlurred ? 'flex' : 'none';
    document.getElementById('shotModal').classList.add('active');
  }

  global.closeModal = function () {
    document.getElementById('shotModal').classList.remove('active');
  };

  global.openScreenshotModal = openScreenshotModal;

  /* ── Timesheets §1.2 idleSeconds ── */
  function renderTimesheets() {
    const entityId = TS().getActiveEntityId();
    const settings = TS().getTrackingSettings(entityId).data;
    const rows = TS().getTimesheets(entityId, { workDate: WORK_DATE });
    const tbody = document.querySelector('.page-content .table tbody');

    if (!tbody) {
      return;
    }

    tbody.innerHTML = rows
      .map((t) => {
        const emp = DATA().EMPLOYEES.find((e) => e.id === t.userId);
        const net = TS().computeNetHours(t.hoursWorked, t.idleSeconds, settings.idleCountsAsWork);
        const idleDisplay = t.idleSeconds == null ? '—' : TS().formatDurationShort(t.idleSeconds);
        const statusClass = t.approvalStatus === 'Approved' ? 'badge-active' : 'badge-pending';

        return `<tr>
          <td><div class="emp-cell"><div class="emp-avatar" style="${emp.avatarStyle}">${emp.initials}</div><span class="emp-name">${emp.name}</span></div></td>
          <td>${t.workDate}</td>
          <td>${t.projectName}</td>
          <td>${t.taskDescription}</td>
          <td><span class="hours-pill">${TS().formatDurationShort(t.hoursWorked * 3600)}</span></td>
          <td><span class="hours-pill" style="color: var(--idle-amber);">${idleDisplay}</span></td>
          <td><span class="hours-pill" style="color: var(--productive-green);">${TS().formatDurationShort(net * 3600)}</span></td>
          <td><span class="badge ${statusClass}">${t.approvalStatus}</span></td>
          <td style="text-align: right;"><a href="employee-timeline.html?userId=${t.userId}" class="btn btn-secondary btn-sm">Verify Timeline</a></td>
        </tr>`;
      })
      .join('');
  }

  /* ── Monitoring Settings §3.1 / §1.1 ── */
  function renderMonitoringSettings() {
    const entityId = TS().getActiveEntityId();
    const settings = TS().getTrackingSettings(entityId).data;
    const inputs = document.querySelectorAll('.settings-section input, .settings-section select');
    const toggles = document.querySelectorAll('.settings-section .toggle-switch input[type="checkbox"]');
    const numbers = document.querySelectorAll('.settings-section input[type="number"]');

    if (toggles.length >= 5) {
      toggles[0].checked = settings.enabled;
      toggles[1].checked = settings.idleCountsAsWork;
      toggles[2].checked = settings.activityEnabled;
      toggles[3].checked = settings.screenshotsEnabled;
      toggles[4].checked = settings.blurScreenshots;
    }

    if (numbers.length >= 5) {
      numbers[0].value = Math.round(settings.idleTimeoutSeconds / 60);
      numbers[1].value = settings.activitySampleSeconds;
      numbers[2].value = Math.round(settings.syncIntervalSeconds / 60);
      numbers[3].value = settings.screenshotsPerHour;
      numbers[4].value = settings.retentionDays;
    }

    const qualitySelect = document.querySelector('.settings-section select');

    if (qualitySelect) {
      qualitySelect.innerHTML = `<option value="20"${settings.screenshotQuality === 20 ? ' selected' : ''}>Low (q20)</option>
        <option value="60"${settings.screenshotQuality === 60 ? ' selected' : ''}>Medium (q60)</option>
        <option value="95"${settings.screenshotQuality === 95 ? ' selected' : ''}>High (q95)</option>`;
    }

    const saveBtn = document.querySelector('.page-action-header .btn-primary');

    if (saveBtn) {
      saveBtn.onclick = function () {
        const payload = {
          enabled: toggles[0].checked,
          idleCountsAsWork: toggles[1].checked,
          activityEnabled: toggles[2].checked,
          screenshotsEnabled: toggles[3].checked,
          blurScreenshots: toggles[4].checked,
          idleTimeoutSeconds: TS().clampSettingsInput('idleTimeoutSeconds', Number(numbers[0].value) * 60),
          activitySampleSeconds: TS().clampSettingsInput('activitySampleSeconds', numbers[1].value),
          syncIntervalSeconds: Number(numbers[2].value) * 60,
          screenshotsPerHour: TS().clampSettingsInput('screenshotsPerHour', numbers[3].value),
          screenshotQuality: TS().clampSettingsInput('screenshotQuality', qualitySelect.value),
          retentionDays: Number(numbers[4].value)
        };
        const res = TS().updateTrackingSettings(entityId, payload);

        alert(res.message);
      };
    }
  }

  /* ── Productivity Rules §3.1 ── */
  function renderProductivityRules() {
    const entityId = TS().getActiveEntityId();
    const settings = TS().getTrackingSettings(entityId).data;
    const rules = settings.rules;
    const defaultSelect = document.querySelector('.filter-bar select');

    if (defaultSelect) {
      defaultSelect.value = rules.defaultCategory.charAt(0).toUpperCase() + rules.defaultCategory.slice(1) + ' (Recommended)';
      defaultSelect.onchange = function () {
        const val = this.value.toLowerCase().split(' ')[0];
        rules.defaultCategory = val;
        TS().reclassifySegments(entityId);
        alert('Re-classification job started — historical segments will update shortly.');
      };
    }

    renderRuleList('prodAppList', rules.productiveApps, 'productive');
    renderRuleListBySelector('.rules-container .card:nth-child(2) .rules-list', rules.unproductiveApps, 'unproductive');
    renderRuleListBySelector('.rules-container .card:nth-child(3) .rules-list', rules.productiveDomains, 'productive');
    renderRuleListBySelector('.rules-container .card:nth-child(4) .rules-list', rules.unproductiveDomains, 'unproductive');
  }

  function renderRuleList(listId, items, category) {
    const list = document.getElementById(listId);

    if (!list) {
      return;
    }

    list.innerHTML = items
      .map(
        (val) => `<div class="rule-item"><span class="rule-value">${val}</span><div style="display:flex;gap:6px;align-items:center;"><span class="badge badge-${category}">${TS().formatCategoryLabel(category)}</span><button class="btn btn-secondary btn-sm" onclick="this.closest('.rule-item').remove()">✕</button></div></div>`
      )
      .join('');
  }

  function renderRuleListBySelector(selector, items, category) {
    const list = document.querySelector(selector);

    if (!list) {
      return;
    }

    list.innerHTML = items
      .map(
        (val) => `<div class="rule-item"><span class="rule-value">${val}</span><div style="display:flex;gap:6px;align-items:center;"><span class="badge badge-${category}">${TS().formatCategoryLabel(category)}</span><button class="btn btn-secondary btn-sm" onclick="this.closest('.rule-item').remove()">✕</button></div></div>`
      )
      .join('');
  }

  /* ── Consent §3.2 ── */
  function renderConsentManagement() {
    const entityId = TS().getActiveEntityId();
    const rows = TS().getConsentRows(entityId);
    const consented = rows.filter((r) => r.status === 'Consented').length;
    const pending = rows.filter((r) => r.status === 'Pending').length;
    const revoked = rows.filter((r) => r.status === 'Revoked').length;
    const summaryValues = document.querySelectorAll('.summary-grid .summary-value');

    if (summaryValues.length >= 4) {
      summaryValues[0].textContent = consented;
      summaryValues[1].textContent = pending;
      summaryValues[2].textContent = revoked;
      summaryValues[3].textContent = 'v1.0';
    }

    const tbody = document.querySelector('.page-content .table tbody');

    if (!tbody) {
      return;
    }

    tbody.innerHTML = rows
      .map((r) => {
        const e = r.employee;
        const badge =
          r.status === 'Consented' ? 'badge-consented' : r.status === 'Pending' ? 'badge-pending' : 'badge-revoked';

        return `<tr>
          <td><div class="emp-cell"><div class="emp-avatar" style="${e.avatarStyle}">${e.initials}</div><div class="emp-details"><span class="emp-name">${e.name}</span><span class="emp-email">${e.email}</span></div></div></td>
          <td>${r.entityName}</td>
          <td><span class="badge ${badge}">${r.status}</span></td>
          <td>${r.consentedAt}</td>
          <td><strong>${r.consentVersion}</strong></td>
          <td>${r.revokedAt}</td>
          <td style="text-align:right;"><button class="btn btn-outline btn-sm" onclick="openConsentModal('${e.name}', '${r.status}', '${r.consentedAt}')">View Consent</button></td>
        </tr>`;
      })
      .join('');
  }

  /* ── Productivity Dashboard §3.3 ── */
  function renderProductivity() {
    const rollup = DATA().PRODUCTIVITY_ROLLUP;
    const totals = rollup.totals;
    const overall = TS().computeProductivityScore([
      { kind: 'active', category: 'productive', seconds: totals.productiveSeconds },
      { kind: 'active', category: 'unproductive', seconds: totals.unproductiveSeconds },
      { kind: 'active', category: 'neutral', seconds: totals.neutralSeconds },
      { kind: 'idle', category: 'neutral', seconds: totals.idleSeconds }
    ]);

    const scoreNum = document.querySelector('.score-number');

    if (scoreNum) {
      scoreNum.textContent = `${overall.score}%`;
    }

    const breakdownCards = document.querySelectorAll('.card[style*="border-left"]');

    if (breakdownCards.length >= 4) {
      breakdownCards[0].querySelector('[style*="font-size: 24px"]').textContent = (totals.productiveSeconds / 3600).toFixed(1) + 'h';
      breakdownCards[1].querySelector('[style*="font-size: 24px"]').textContent = (totals.unproductiveSeconds / 3600).toFixed(1) + 'h';
      breakdownCards[2].querySelector('[style*="font-size: 24px"]').textContent = (totals.neutralSeconds / 3600).toFixed(1) + 'h';
      breakdownCards[3].querySelector('[style*="font-size: 24px"]').textContent = (totals.idleSeconds / 3600).toFixed(1) + 'h';
    }

    const bars = document.querySelectorAll('.chart-bar-fill');

    rollup.dailyScores.forEach((day, i) => {
      if (bars[i]) {
        bars[i].style.height = `${day.score}%`;
        bars[i].title = `${day.day}: ${day.score}%`;
      }
    });

    const teamTable = document.querySelector('.card .table tbody');

    if (teamTable && teamTable.closest('.card')?.querySelector('.card-title')?.textContent.includes('Team')) {
      teamTable.innerHTML = rollup.teamComparison
        .map(
          (t) => `<tr><td><strong>${t.team}</strong></td><td><div style="display:flex;align-items:center;gap:8px;"><div class="progress-bar-container" style="width:120px;"><div class="progress-bar-fill ${progressClass(t.score)}" style="width:${t.score}%;"></div></div><span>${t.score}%</span></div></td></tr>`
        )
        .join('');
    }

    const teamBars = document.querySelector('.card .card-title')?.textContent.includes('Team Productivity')
      ? document.querySelectorAll('.card .progress-bar-fill.progress-high, .card .progress-bar-fill.progress-medium')
      : [];

    const teamSection = Array.from(document.querySelectorAll('.card')).find((c) =>
      c.querySelector('.card-title')?.textContent.includes('Team Productivity Comparison')
    );

    if (teamSection) {
      rollup.teamComparison.forEach((t, i) => {
        const rows = teamSection.querySelectorAll('[style*="justify-content: space-between"]');

        if (rows[i]) {
          rows[i].querySelector('span:first-child').textContent = t.team;
          rows[i].querySelector('span:last-child').textContent = `${t.score}%`;
          rows[i].querySelector('span:last-child').style.color =
            t.score >= 75 ? 'var(--productive-green)' : 'var(--idle-amber)';
        }

        const bar = teamSection.querySelectorAll('.progress-bar-fill')[i];

        if (bar) {
          bar.style.width = `${t.score}%`;
          bar.className = 'progress-bar-fill ' + progressClass(t.score);
        }
      });
    }

    const ratioSection = Array.from(document.querySelectorAll('.card')).find((c) =>
      c.querySelector('.card-title')?.textContent.includes('Weekly Productive vs Unproductive')
    );

    if (ratioSection) {
      const activeTotal = totals.productiveSeconds + totals.unproductiveSeconds + totals.neutralSeconds;
      const pPct = activeTotal > 0 ? Math.round((totals.productiveSeconds / activeTotal) * 100) : 0;
      const nPct = activeTotal > 0 ? Math.round((totals.neutralSeconds / activeTotal) * 100) : 0;
      const uPct = activeTotal > 0 ? Math.round((totals.unproductiveSeconds / activeTotal) * 100) : 0;
      const segments = ratioSection.querySelectorAll('[style*="width:"]');

      if (segments.length >= 3) {
        segments[0].style.width = `${pPct}%`;
        segments[0].textContent = `${pPct}% Productive`;
        segments[1].style.width = `${nPct}%`;
        segments[1].textContent = `${nPct}%`;
        segments[2].style.width = `${uPct}%`;
        segments[2].textContent = `${uPct}%`;
      }
    }
  }

  /* ── Employee Detail ── */
  function renderEmployeeDetail() {
    const params = new URLSearchParams(window.location.search);
    const userId = Number(params.get('userId')) || 412;
    const entityId = TS().getActiveEntityId();
    const employee = DATA().EMPLOYEES.find((e) => e.id === userId) || DATA().EMPLOYEES[0];
    const settings = TS().getTrackingSettings(entityId).data;
    const segments = TS().getDayTimeline(employee.id, WORK_DATE, entityId);
    const stats = TS().computeProductivityScore(segments);
    const timesheet = TS().getTimesheets(entityId, { userId: employee.id, workDate: WORK_DATE })[0];
    const shots = TS().getScreenshotsForDay(employee.id, WORK_DATE, entityId);
    const apps = TS().getAppBreakdown(segments);
    const domains = TS().getDomainBreakdown(segments);

    const avatar = document.querySelector('.page-content .emp-avatar');

    if (avatar) {
      avatar.textContent = employee.initials;
      avatar.style.cssText = (employee.avatarStyle || '') + ' width: 56px; height: 56px; font-size: 22px;';
    }

    const nameEl = document.querySelector('.page-content h1');

    if (nameEl) {
      nameEl.textContent = employee.name;
    }

    const metaEl = document.querySelector('.page-content h1 + div');

    if (metaEl) {
      metaEl.innerHTML = `<span>Department: <strong>Engineering</strong></span><span>•</span><span>Team: <strong>${employee.team}</strong></span><span>•</span><span>Project: <strong>${employee.project}</strong></span>`;
    }

    const timelineLink = document.querySelector('.page-content .btn-primary');

    if (timelineLink) {
      timelineLink.href = `employee-timeline.html?userId=${employee.id}`;
    }

    const gross = timesheet ? timesheet.hoursWorked * 3600 : 0;
    const idle = timesheet ? timesheet.idleSeconds || 0 : stats.idle;
    const net = timesheet ? TS().computeNetHours(timesheet.hoursWorked, timesheet.idleSeconds, settings.idleCountsAsWork) * 3600 : gross - idle;

    const metrics = document.querySelectorAll('.summary-grid[style*="repeat(7"] .card [style*="font-size: 18px"]');

    if (metrics.length >= 7) {
      metrics[0].textContent = TS().formatDurationShort(gross);
      metrics[1].textContent = TS().formatDurationShort(idle);
      metrics[2].textContent = TS().formatDurationShort(net);
      metrics[3].textContent = TS().formatDurationShort(stats.productive);
      metrics[4].textContent = TS().formatDurationShort(stats.unproductive);
      metrics[5].textContent = TS().formatDurationShort(stats.neutral);
      metrics[6].textContent = String(shots.length);
    }

    const previewTrack = document.querySelector('.card .timeline-track');

    if (previewTrack) {
      previewTrack.innerHTML = segments
        .map((seg) => `<div class="timeline-block ${TS().timelineBlockClass(seg)}" style="width:${segmentWidthPercent(seg)}%;" title="${timeFromIso(seg.startedAt)} - ${seg.appName || 'Idle'}"></div>`)
        .join('');
    }

    const tables = document.querySelectorAll('.page-content table tbody');

    if (tables[0]) {
      tables[0].innerHTML = apps
        .slice(0, 3)
        .map(
          (a) => `<tr><td><strong>${a.appName}</strong></td><td><span class="badge ${TS().categoryBadgeClass(a.category)}">${TS().formatCategoryLabel(a.category)}</span></td><td>${TS().formatDuration(a.seconds)}</td></tr>`
        )
        .join('');
    }

    if (tables[1]) {
      tables[1].innerHTML = domains
        .slice(0, 3)
        .map(
          (d) => `<tr><td><strong>${d.domain}</strong></td><td><span class="badge ${TS().categoryBadgeClass(d.category)}">${TS().formatCategoryLabel(d.category)}</span></td><td>${TS().formatDuration(d.seconds)}</td></tr>`
        )
        .join('');
    }

    const syncEl = document.querySelector('.header-sync-status span:last-child');

    if (syncEl) {
      syncEl.textContent = `Last synced ${TS().getLastSyncedLabel(employee.lastReceivedAt)}`;
    }
  }

  function boot() {
    global.ObeliskApp.initCommon();
    const page = document.body.dataset.page;

    if (page && global.ObeliskPages[page]) {
      global.ObeliskPages[page]();
    }
  }

  global.ObeliskPages = {
    reloadCurrentPage,
    dashboard: renderDashboard,
    timeline: renderEmployeeTimeline,
    activity: renderActivity,
    screenshots: renderScreenshots,
    timesheets: renderTimesheets,
    settings: renderMonitoringSettings,
    rules: renderProductivityRules,
    consent: renderConsentManagement,
    productivity: renderProductivity,
    employeeDetail: renderEmployeeDetail
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);
