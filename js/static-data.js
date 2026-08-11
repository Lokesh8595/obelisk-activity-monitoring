/**
 * Obelisk Activity Monitoring — static mock store.
 * Field names match backend-web-requirements §1.1–1.7 API contracts.
 * Entity-scoped like Angular src (X-Entity-Id / activeEntityId).
 */
(function (global) {
  const ENTITIES = [
    { id: 1, name: 'Obelisk Tech Ltd (HQ)' },
    { id: 2, name: 'Obelisk Europe Division' },
    { id: 3, name: 'Obelisk Asia Pacific' }
  ];

  const EMPLOYEES = [
    {
      id: 412,
      entityId: 1,
      name: 'Akshay Prajapati',
      email: 'akshay@obelisk.io',
      initials: 'AP',
      avatarStyle: '',
      team: 'Core Engineering',
      project: 'Obelisk ERP',
      status: 'active',
      lastReceivedAt: '2026-08-10T16:38:00+05:30'
    },
    {
      id: 413,
      entityId: 1,
      name: 'Sarah Chen',
      email: 'sarah.c@obelisk.io',
      initials: 'SC',
      avatarStyle: 'background: #fce7f3; color: #be185d;',
      team: 'Product & UI/UX',
      project: 'Mobile Redesign',
      status: 'active',
      lastReceivedAt: '2026-08-10T16:40:00+05:30'
    },
    {
      id: 414,
      entityId: 1,
      name: 'Marcus Vance',
      email: 'marcus@obelisk.io',
      initials: 'MV',
      avatarStyle: 'background: #fef3c7; color: #b45309;',
      team: 'Core Engineering',
      project: 'Cloud Migration',
      status: 'idle',
      lastReceivedAt: '2026-08-10T16:26:00+05:30'
    },
    {
      id: 415,
      entityId: 1,
      name: 'Elena Rostova',
      email: 'elena.r@obelisk.io',
      initials: 'ER',
      avatarStyle: 'background: #e0e7ff; color: #4338ca;',
      team: 'Quality Assurance',
      project: 'Obelisk ERP',
      status: 'active',
      lastReceivedAt: '2026-08-10T16:37:00+05:30'
    },
    {
      id: 416,
      entityId: 3,
      name: 'David Kim',
      email: 'david.k@obelisk.io',
      initials: 'DK',
      avatarStyle: 'background: #dcfce7; color: #15803d;',
      team: 'Digital Marketing',
      project: 'Growth Q3',
      status: 'offline',
      lastReceivedAt: '2026-08-10T13:45:00+05:30'
    },
    {
      id: 417,
      entityId: 1,
      name: 'Priya Sharma',
      email: 'priya.s@obelisk.io',
      initials: 'PS',
      avatarStyle: 'background: #fae8ff; color: #86198f;',
      team: 'Core Engineering',
      project: 'Obelisk ERP',
      status: 'active',
      lastReceivedAt: '2026-08-10T16:30:00+05:30'
    }
  ];

  /** §2.2 tracking_settings per entity — §1.1 payload shape */
  const TRACKING_SETTINGS = {
    1: {
      enabled: true,
      consentOnFile: true,
      idleTimeoutSeconds: 600,
      idleCountsAsWork: false,
      screenshotsEnabled: true,
      screenshotsPerHour: 3,
      screenshotQuality: 60,
      blurScreenshots: false,
      activityEnabled: true,
      activitySampleSeconds: 10,
      syncIntervalSeconds: 60,
      retentionDays: 30,
      rules: {
        productiveApps: ['code.exe', 'cursor.exe', 'slack.exe', 'teams.exe', 'figma.exe'],
        unproductiveApps: ['steam.exe', 'discord.exe'],
        productiveDomains: ['github.com', 'atlassian.net', 'stackoverflow.com', 'linear.app'],
        unproductiveDomains: ['youtube.com', 'facebook.com', 'twitter.com', 'reddit.com'],
        defaultCategory: 'neutral'
      }
    },
    2: {
      enabled: true,
      consentOnFile: false,
      idleTimeoutSeconds: 600,
      idleCountsAsWork: false,
      screenshotsEnabled: false,
      screenshotsPerHour: 3,
      screenshotQuality: 60,
      blurScreenshots: true,
      activityEnabled: true,
      activitySampleSeconds: 10,
      syncIntervalSeconds: 60,
      retentionDays: 30,
      rules: {
        productiveApps: ['code.exe', 'slack.exe'],
        unproductiveApps: ['steam.exe'],
        productiveDomains: ['github.com', 'atlassian.net'],
        unproductiveDomains: ['youtube.com', 'facebook.com'],
        defaultCategory: 'neutral'
      }
    },
    3: {
      enabled: false,
      consentOnFile: false,
      idleTimeoutSeconds: 600,
      idleCountsAsWork: false,
      screenshotsEnabled: false,
      screenshotsPerHour: 3,
      screenshotQuality: 60,
      blurScreenshots: false,
      activityEnabled: true,
      activitySampleSeconds: 10,
      syncIntervalSeconds: 60,
      retentionDays: 30,
      rules: {
        productiveApps: ['code.exe'],
        unproductiveApps: ['steam.exe'],
        productiveDomains: ['github.com'],
        unproductiveDomains: ['youtube.com'],
        defaultCategory: 'neutral'
      }
    }
  };

  /** §2.3 user_monitoring_consent */
  const USER_CONSENT = [
    {
      userId: 412,
      entityId: 1,
      consentedAt: '2026-01-15T10:00:00+05:30',
      consentVersion: 'v1.0',
      revokedAt: null
    },
    {
      userId: 413,
      entityId: 1,
      consentedAt: '2026-01-18T11:30:00+05:30',
      consentVersion: 'v1.0',
      revokedAt: null
    },
    {
      userId: 414,
      entityId: 2,
      consentedAt: null,
      consentVersion: 'v1.0',
      revokedAt: null
    },
    {
      userId: 416,
      entityId: 3,
      consentedAt: '2026-02-01T09:00:00+05:30',
      consentVersion: 'v1.0',
      revokedAt: '2026-07-20T14:00:00+05:30'
    }
  ];

  /** §2.4 activity_segments — RFC 3339 local offset timestamps */
  const ACTIVITY_SEGMENTS = [
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000001',
      userId: 412,
      entityId: 1,
      projectId: 88,
      taskId: 1204,
      kind: 'active',
      appName: 'code.exe',
      appTitle: 'App.tsx - Obelisk ERP',
      domain: 'github.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T09:00:00+05:30',
      endedAt: '2026-08-10T09:30:00+05:30',
      seconds: 1800,
      receivedAt: '2026-08-10T09:31:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000002',
      userId: 412,
      entityId: 1,
      projectId: 88,
      taskId: 1204,
      kind: 'idle',
      appName: '',
      appTitle: 'Away from Desk',
      domain: '',
      clientCategory: 'neutral',
      category: 'neutral',
      startedAt: '2026-08-10T09:30:00+05:30',
      endedAt: '2026-08-10T09:42:00+05:30',
      seconds: 720,
      receivedAt: '2026-08-10T09:43:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000003',
      userId: 412,
      entityId: 1,
      projectId: 88,
      taskId: 1204,
      kind: 'active',
      appName: 'cursor.exe',
      appTitle: 'server.ts - Backend API',
      domain: 'github.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T09:42:00+05:30',
      endedAt: '2026-08-10T10:30:00+05:30',
      seconds: 2880,
      receivedAt: '2026-08-10T10:31:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000004',
      userId: 412,
      entityId: 1,
      projectId: 88,
      taskId: 1204,
      kind: 'active',
      appName: 'slack.exe',
      appTitle: '#engineering-chat - Obelisk Work',
      domain: 'slack.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T10:30:00+05:30',
      endedAt: '2026-08-10T11:15:00+05:30',
      seconds: 2700,
      receivedAt: '2026-08-10T11:16:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000005',
      userId: 412,
      entityId: 1,
      projectId: 88,
      taskId: 1204,
      kind: 'active',
      appName: 'chrome.exe',
      appTitle: 'TechNews - HackerNews',
      domain: 'news.ycombinator.com',
      clientCategory: 'neutral',
      category: 'neutral',
      startedAt: '2026-08-10T11:15:00+05:30',
      endedAt: '2026-08-10T11:45:00+05:30',
      seconds: 1800,
      receivedAt: '2026-08-10T11:46:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000006',
      userId: 412,
      entityId: 1,
      projectId: 88,
      taskId: 1204,
      kind: 'active',
      appName: 'chrome.exe',
      appTitle: 'YouTube - Tech Podcast',
      domain: 'youtube.com',
      clientCategory: 'unproductive',
      category: 'unproductive',
      startedAt: '2026-08-10T11:45:00+05:30',
      endedAt: '2026-08-10T12:00:00+05:30',
      seconds: 900,
      receivedAt: '2026-08-10T12:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000007',
      userId: 412,
      entityId: 1,
      projectId: 88,
      taskId: 1204,
      kind: 'idle',
      appName: '',
      appTitle: 'Lunch Break',
      domain: '',
      clientCategory: 'neutral',
      category: 'neutral',
      startedAt: '2026-08-10T12:00:00+05:30',
      endedAt: '2026-08-10T13:00:00+05:30',
      seconds: 3600,
      receivedAt: '2026-08-10T13:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000008',
      userId: 412,
      entityId: 1,
      projectId: 88,
      taskId: 1204,
      kind: 'active',
      appName: 'chrome.exe',
      appTitle: 'GitHub Issues',
      domain: '',
      clientCategory: 'neutral',
      category: 'neutral',
      startedAt: '2026-08-10T14:00:00+05:30',
      endedAt: '2026-08-10T14:12:00+05:30',
      seconds: 720,
      receivedAt: '2026-08-10T14:13:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000009',
      userId: 413,
      entityId: 1,
      projectId: 90,
      taskId: 1301,
      kind: 'active',
      appName: 'figma.exe',
      appTitle: 'ERP Canvas - Mobile Redesign',
      domain: 'figma.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T12:00:00+05:30',
      endedAt: '2026-08-10T13:30:00+05:30',
      seconds: 5400,
      receivedAt: '2026-08-10T13:31:00+05:30'
    }
  ];

  /** §2.5 screenshots — app/domain joined at display time from segments §3.3 */
  const SCREENSHOTS = [
    {
      id: '4b21c3d4-e001-4000-8000-000000000001',
      userId: 412,
      entityId: 1,
      projectId: 88,
      taskId: 1204,
      capturedAt: '2026-08-10T10:30:00+05:30',
      width: 1697,
      height: 955,
      monitors: 2,
      bytes: 168432,
      duringIdle: false,
      blurred: false,
      receivedAt: '2026-08-10T10:30:05+05:30'
    },
    {
      id: '4b21c3d4-e001-4000-8000-000000000002',
      userId: 412,
      entityId: 1,
      projectId: 88,
      taskId: 1204,
      capturedAt: '2026-08-10T14:05:00+05:30',
      width: 1697,
      height: 955,
      monitors: 2,
      bytes: 145200,
      duringIdle: true,
      blurred: false,
      receivedAt: '2026-08-10T14:05:03+05:30'
    },
    {
      id: '4b21c3d4-e001-4000-8000-000000000003',
      userId: 413,
      entityId: 1,
      projectId: 90,
      taskId: 1301,
      capturedAt: '2026-08-10T13:45:00+05:30',
      width: 1920,
      height: 1080,
      monitors: 1,
      bytes: 210000,
      duringIdle: false,
      blurred: true,
      receivedAt: '2026-08-10T13:45:04+05:30'
    },
    {
      id: '4b21c3d4-e001-4000-8000-000000000004',
      userId: 413,
      entityId: 1,
      projectId: 90,
      taskId: 1301,
      capturedAt: '2026-08-10T12:30:00+05:30',
      width: 1920,
      height: 1080,
      monitors: 1,
      bytes: 195000,
      duringIdle: false,
      blurred: false,
      receivedAt: '2026-08-10T12:30:02+05:30'
    }
  ];

  /** §1.2 timesheets with idleSeconds tri-state (null | 0 | N) */
  const TIMESHEETS = [
    {
      userId: 412,
      entityId: 1,
      workDate: '2026-08-10',
      projectName: 'Obelisk ERP',
      taskDescription: 'Activity Monitoring API Integration',
      startTime: '09:00:00',
      endTime: '17:00:00',
      hoursWorked: 8,
      idleSeconds: 2880,
      approvalStatus: 'Approved'
    },
    {
      userId: 413,
      entityId: 1,
      workDate: '2026-08-10',
      projectName: 'Mobile Redesign',
      taskDescription: 'Figma UI Design System Specs',
      startTime: '09:00:00',
      endTime: '17:00:00',
      hoursWorked: 8,
      idleSeconds: 1500,
      approvalStatus: 'Approved'
    },
    {
      userId: 414,
      entityId: 1,
      workDate: '2026-08-10',
      projectName: 'Cloud Migration',
      taskDescription: 'Kubernetes Cluster Setup',
      startTime: '09:00:00',
      endTime: '17:00:00',
      hoursWorked: 8,
      idleSeconds: 7800,
      approvalStatus: 'Under Review'
    },
    {
      userId: 415,
      entityId: 1,
      workDate: '2026-08-10',
      projectName: 'Obelisk ERP',
      taskDescription: 'E2E Automation Testing Suite',
      startTime: '09:00:00',
      endTime: '17:00:00',
      hoursWorked: 8,
      idleSeconds: 2400,
      approvalStatus: 'Approved'
    },
    {
      userId: 417,
      entityId: 1,
      workDate: '2026-08-10',
      projectName: 'Obelisk ERP',
      taskDescription: 'Database Optimization & Indexing',
      startTime: '09:00:00',
      endTime: '17:00:00',
      hoursWorked: 8,
      idleSeconds: 900,
      approvalStatus: 'Approved'
    }
  ];

  /** Weekly productivity rollup for §1.7 / §3.3 dashboards */
  const PRODUCTIVITY_ROLLUP = {
    team: 'Core Engineering',
    weekLabel: 'Aug 04 - Aug 10, 2026',
    dailyScores: [
      { day: 'Mon', score: 78 },
      { day: 'Tue', score: 85 },
      { day: 'Wed', score: 82 },
      { day: 'Thu', score: 88 },
      { day: 'Fri', score: 80 }
    ],
    totals: {
      productiveSeconds: 2464200,
      unproductiveSeconds: 151560,
      neutralSeconds: 317520,
      idleSeconds: 331200
    },
    teamComparison: [
      { team: 'Core Engineering', score: 82 },
      { team: 'Product & UI/UX', score: 88 },
      { team: 'Quality Assurance', score: 79 },
      { team: 'Digital Marketing', score: 65 }
    ]
  };

  global.ObeliskStaticData = {
    ENTITIES,
    EMPLOYEES,
    TRACKING_SETTINGS,
    USER_CONSENT,
    ACTIVITY_SEGMENTS,
    SCREENSHOTS,
    TIMESHEETS,
    PRODUCTIVITY_ROLLUP
  };
})(window);
