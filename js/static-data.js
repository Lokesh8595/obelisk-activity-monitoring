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
    },
    {
      id: 418,
      entityId: 2,
      name: 'James Okafor',
      email: 'james.o@obelisk.io',
      initials: 'JO',
      avatarStyle: 'background: #cffafe; color: #0e7490;',
      team: 'Platform Ops',
      project: 'EU Compliance',
      status: 'active',
      lastReceivedAt: '2026-08-10T16:20:00+05:30'
    },
    {
      id: 419,
      entityId: 2,
      name: 'Amélie Dubois',
      email: 'amelie.d@obelisk.io',
      initials: 'AD',
      avatarStyle: 'background: #fef9c3; color: #a16207;',
      team: 'Customer Success',
      project: 'EU Onboarding',
      status: 'idle',
      lastReceivedAt: '2026-08-10T15:55:00+05:30'
    },
    {
      id: 420,
      entityId: 3,
      name: 'Hiro Tanaka',
      email: 'hiro.t@obelisk.io',
      initials: 'HT',
      avatarStyle: 'background: #ffedd5; color: #c2410c;',
      team: 'Digital Marketing',
      project: 'Growth Q3',
      status: 'active',
      lastReceivedAt: '2026-08-10T14:10:00+05:30'
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
      entityId: 1,
      consentedAt: '2026-01-20T09:15:00+05:30',
      consentVersion: 'v1.0',
      revokedAt: null
    },
    {
      userId: 415,
      entityId: 1,
      consentedAt: '2026-01-22T14:00:00+05:30',
      consentVersion: 'v1.0',
      revokedAt: null
    },
    {
      userId: 417,
      entityId: 1,
      consentedAt: '2026-02-05T10:30:00+05:30',
      consentVersion: 'v1.0',
      revokedAt: null
    },
    {
      userId: 418,
      entityId: 2,
      consentedAt: null,
      consentVersion: 'v1.0',
      revokedAt: null
    },
    {
      userId: 419,
      entityId: 2,
      consentedAt: '2026-03-01T11:00:00+01:00',
      consentVersion: 'v1.0',
      revokedAt: null
    },
    {
      userId: 416,
      entityId: 3,
      consentedAt: '2026-02-01T09:00:00+05:30',
      consentVersion: 'v1.0',
      revokedAt: '2026-07-20T14:00:00+05:30'
    },
    {
      userId: 420,
      entityId: 3,
      consentedAt: '2026-03-12T08:00:00+09:00',
      consentVersion: 'v1.0',
      revokedAt: null
    }
  ];

  /** §2.4 activity_segments — RFC 3339 local offset timestamps */
  const ACTIVITY_SEGMENTS = [
    /* ── Akshay Prajapati (412) ── */
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
      domain: 'github.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T13:00:00+05:30',
      endedAt: '2026-08-10T14:00:00+05:30',
      seconds: 3600,
      receivedAt: '2026-08-10T14:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000009',
      userId: 412,
      entityId: 1,
      projectId: 88,
      taskId: 1204,
      kind: 'idle',
      appName: '',
      appTitle: 'Short Break',
      domain: '',
      clientCategory: 'neutral',
      category: 'neutral',
      startedAt: '2026-08-10T14:00:00+05:30',
      endedAt: '2026-08-10T14:12:00+05:30',
      seconds: 720,
      receivedAt: '2026-08-10T14:13:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-00000000000a',
      userId: 412,
      entityId: 1,
      projectId: 88,
      taskId: 1204,
      kind: 'active',
      appName: 'cursor.exe',
      appTitle: 'tracking-service.js - Monitoring',
      domain: 'linear.app',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T14:12:00+05:30',
      endedAt: '2026-08-10T16:00:00+05:30',
      seconds: 6480,
      receivedAt: '2026-08-10T16:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-00000000000b',
      userId: 412,
      entityId: 1,
      projectId: 88,
      taskId: 1204,
      kind: 'active',
      appName: 'teams.exe',
      appTitle: 'Daily Standup - Core Eng',
      domain: 'teams.microsoft.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T16:00:00+05:30',
      endedAt: '2026-08-10T16:38:00+05:30',
      seconds: 2280,
      receivedAt: '2026-08-10T16:39:00+05:30'
    },

    /* ── Sarah Chen (413) ── */
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000101',
      userId: 413,
      entityId: 1,
      projectId: 90,
      taskId: 1301,
      kind: 'active',
      appName: 'figma.exe',
      appTitle: 'Design System Tokens',
      domain: 'figma.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T09:00:00+05:30',
      endedAt: '2026-08-10T10:45:00+05:30',
      seconds: 6300,
      receivedAt: '2026-08-10T10:46:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000102',
      userId: 413,
      entityId: 1,
      projectId: 90,
      taskId: 1301,
      kind: 'active',
      appName: 'slack.exe',
      appTitle: '#design-feedback',
      domain: 'slack.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T10:45:00+05:30',
      endedAt: '2026-08-10T11:15:00+05:30',
      seconds: 1800,
      receivedAt: '2026-08-10T11:16:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000103',
      userId: 413,
      entityId: 1,
      projectId: 90,
      taskId: 1301,
      kind: 'active',
      appName: 'chrome.exe',
      appTitle: 'Dribbble Inspiration',
      domain: 'dribbble.com',
      clientCategory: 'neutral',
      category: 'neutral',
      startedAt: '2026-08-10T11:15:00+05:30',
      endedAt: '2026-08-10T11:45:00+05:30',
      seconds: 1800,
      receivedAt: '2026-08-10T11:46:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000104',
      userId: 413,
      entityId: 1,
      projectId: 90,
      taskId: 1301,
      kind: 'idle',
      appName: '',
      appTitle: 'Lunch Break',
      domain: '',
      clientCategory: 'neutral',
      category: 'neutral',
      startedAt: '2026-08-10T11:45:00+05:30',
      endedAt: '2026-08-10T12:30:00+05:30',
      seconds: 2700,
      receivedAt: '2026-08-10T12:31:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000105',
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
      startedAt: '2026-08-10T12:30:00+05:30',
      endedAt: '2026-08-10T15:00:00+05:30',
      seconds: 9000,
      receivedAt: '2026-08-10T15:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000106',
      userId: 413,
      entityId: 1,
      projectId: 90,
      taskId: 1301,
      kind: 'active',
      appName: 'chrome.exe',
      appTitle: 'YouTube - UI Motion Study',
      domain: 'youtube.com',
      clientCategory: 'unproductive',
      category: 'unproductive',
      startedAt: '2026-08-10T15:00:00+05:30',
      endedAt: '2026-08-10T15:20:00+05:30',
      seconds: 1200,
      receivedAt: '2026-08-10T15:21:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000107',
      userId: 413,
      entityId: 1,
      projectId: 90,
      taskId: 1301,
      kind: 'active',
      appName: 'figma.exe',
      appTitle: 'Prototype Review Board',
      domain: 'figma.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T15:20:00+05:30',
      endedAt: '2026-08-10T16:40:00+05:30',
      seconds: 4800,
      receivedAt: '2026-08-10T16:41:00+05:30'
    },

    /* ── Marcus Vance (414) — high idle ── */
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000201',
      userId: 414,
      entityId: 1,
      projectId: 91,
      taskId: 1401,
      kind: 'active',
      appName: 'code.exe',
      appTitle: 'helm-charts - Cloud Migration',
      domain: 'github.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T09:00:00+05:30',
      endedAt: '2026-08-10T10:00:00+05:30',
      seconds: 3600,
      receivedAt: '2026-08-10T10:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000202',
      userId: 414,
      entityId: 1,
      projectId: 91,
      taskId: 1401,
      kind: 'idle',
      appName: '',
      appTitle: 'Away from Desk',
      domain: '',
      clientCategory: 'neutral',
      category: 'neutral',
      startedAt: '2026-08-10T10:00:00+05:30',
      endedAt: '2026-08-10T11:30:00+05:30',
      seconds: 5400,
      receivedAt: '2026-08-10T11:31:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000203',
      userId: 414,
      entityId: 1,
      projectId: 91,
      taskId: 1401,
      kind: 'active',
      appName: 'chrome.exe',
      appTitle: 'Reddit - r/kubernetes',
      domain: 'reddit.com',
      clientCategory: 'unproductive',
      category: 'unproductive',
      startedAt: '2026-08-10T11:30:00+05:30',
      endedAt: '2026-08-10T12:00:00+05:30',
      seconds: 1800,
      receivedAt: '2026-08-10T12:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000204',
      userId: 414,
      entityId: 1,
      projectId: 91,
      taskId: 1401,
      kind: 'idle',
      appName: '',
      appTitle: 'Lunch Break',
      domain: '',
      clientCategory: 'neutral',
      category: 'neutral',
      startedAt: '2026-08-10T12:00:00+05:30',
      endedAt: '2026-08-10T13:30:00+05:30',
      seconds: 5400,
      receivedAt: '2026-08-10T13:31:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000205',
      userId: 414,
      entityId: 1,
      projectId: 91,
      taskId: 1401,
      kind: 'active',
      appName: 'code.exe',
      appTitle: 'terraform - Cluster Setup',
      domain: 'atlassian.net',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T13:30:00+05:30',
      endedAt: '2026-08-10T15:00:00+05:30',
      seconds: 5400,
      receivedAt: '2026-08-10T15:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000206',
      userId: 414,
      entityId: 1,
      projectId: 91,
      taskId: 1401,
      kind: 'idle',
      appName: '',
      appTitle: 'Idle - No Input',
      domain: '',
      clientCategory: 'neutral',
      category: 'neutral',
      startedAt: '2026-08-10T15:00:00+05:30',
      endedAt: '2026-08-10T16:26:00+05:30',
      seconds: 5160,
      receivedAt: '2026-08-10T16:27:00+05:30'
    },

    /* ── Elena Rostova (415) ── */
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000301',
      userId: 415,
      entityId: 1,
      projectId: 88,
      taskId: 1501,
      kind: 'active',
      appName: 'code.exe',
      appTitle: 'e2e.spec.ts - QA Suite',
      domain: 'github.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T09:00:00+05:30',
      endedAt: '2026-08-10T11:00:00+05:30',
      seconds: 7200,
      receivedAt: '2026-08-10T11:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000302',
      userId: 415,
      entityId: 1,
      projectId: 88,
      taskId: 1501,
      kind: 'active',
      appName: 'chrome.exe',
      appTitle: 'Jira - QA Board',
      domain: 'atlassian.net',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T11:00:00+05:30',
      endedAt: '2026-08-10T12:00:00+05:30',
      seconds: 3600,
      receivedAt: '2026-08-10T12:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000303',
      userId: 415,
      entityId: 1,
      projectId: 88,
      taskId: 1501,
      kind: 'idle',
      appName: '',
      appTitle: 'Lunch Break',
      domain: '',
      clientCategory: 'neutral',
      category: 'neutral',
      startedAt: '2026-08-10T12:00:00+05:30',
      endedAt: '2026-08-10T12:40:00+05:30',
      seconds: 2400,
      receivedAt: '2026-08-10T12:41:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000304',
      userId: 415,
      entityId: 1,
      projectId: 88,
      taskId: 1501,
      kind: 'active',
      appName: 'chrome.exe',
      appTitle: 'Stack Overflow - Playwright',
      domain: 'stackoverflow.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T12:40:00+05:30',
      endedAt: '2026-08-10T13:20:00+05:30',
      seconds: 2400,
      receivedAt: '2026-08-10T13:21:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000305',
      userId: 415,
      entityId: 1,
      projectId: 88,
      taskId: 1501,
      kind: 'active',
      appName: 'code.exe',
      appTitle: 'regression.spec.ts',
      domain: 'github.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T13:20:00+05:30',
      endedAt: '2026-08-10T15:30:00+05:30',
      seconds: 7800,
      receivedAt: '2026-08-10T15:31:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000306',
      userId: 415,
      entityId: 1,
      projectId: 88,
      taskId: 1501,
      kind: 'active',
      appName: 'slack.exe',
      appTitle: '#qa-alerts',
      domain: 'slack.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T15:30:00+05:30',
      endedAt: '2026-08-10T16:37:00+05:30',
      seconds: 4020,
      receivedAt: '2026-08-10T16:38:00+05:30'
    },

    /* ── Priya Sharma (417) ── */
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000401',
      userId: 417,
      entityId: 1,
      projectId: 88,
      taskId: 1601,
      kind: 'active',
      appName: 'code.exe',
      appTitle: 'migration.sql - Indexing',
      domain: 'github.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T09:00:00+05:30',
      endedAt: '2026-08-10T11:30:00+05:30',
      seconds: 9000,
      receivedAt: '2026-08-10T11:31:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000402',
      userId: 417,
      entityId: 1,
      projectId: 88,
      taskId: 1601,
      kind: 'active',
      appName: 'chrome.exe',
      appTitle: 'Postgres Docs - EXPLAIN',
      domain: 'postgresql.org',
      clientCategory: 'neutral',
      category: 'neutral',
      startedAt: '2026-08-10T11:30:00+05:30',
      endedAt: '2026-08-10T12:00:00+05:30',
      seconds: 1800,
      receivedAt: '2026-08-10T12:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000403',
      userId: 417,
      entityId: 1,
      projectId: 88,
      taskId: 1601,
      kind: 'idle',
      appName: '',
      appTitle: 'Lunch Break',
      domain: '',
      clientCategory: 'neutral',
      category: 'neutral',
      startedAt: '2026-08-10T12:00:00+05:30',
      endedAt: '2026-08-10T12:45:00+05:30',
      seconds: 2700,
      receivedAt: '2026-08-10T12:46:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000404',
      userId: 417,
      entityId: 1,
      projectId: 88,
      taskId: 1601,
      kind: 'active',
      appName: 'cursor.exe',
      appTitle: 'query-optimizer.ts',
      domain: 'linear.app',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T12:45:00+05:30',
      endedAt: '2026-08-10T15:30:00+05:30',
      seconds: 9900,
      receivedAt: '2026-08-10T15:31:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000405',
      userId: 417,
      entityId: 1,
      projectId: 88,
      taskId: 1601,
      kind: 'active',
      appName: 'slack.exe',
      appTitle: '#db-performance',
      domain: 'slack.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T15:30:00+05:30',
      endedAt: '2026-08-10T16:30:00+05:30',
      seconds: 3600,
      receivedAt: '2026-08-10T16:31:00+05:30'
    },

    /* ── James Okafor (418) — EU entity ── */
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000501',
      userId: 418,
      entityId: 2,
      projectId: 95,
      taskId: 1701,
      kind: 'active',
      appName: 'code.exe',
      appTitle: 'gdpr-audit.ts',
      domain: 'github.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T09:00:00+05:30',
      endedAt: '2026-08-10T12:00:00+05:30',
      seconds: 10800,
      receivedAt: '2026-08-10T12:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000502',
      userId: 418,
      entityId: 2,
      projectId: 95,
      taskId: 1701,
      kind: 'idle',
      appName: '',
      appTitle: 'Lunch',
      domain: '',
      clientCategory: 'neutral',
      category: 'neutral',
      startedAt: '2026-08-10T12:00:00+05:30',
      endedAt: '2026-08-10T13:00:00+05:30',
      seconds: 3600,
      receivedAt: '2026-08-10T13:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000503',
      userId: 418,
      entityId: 2,
      projectId: 95,
      taskId: 1701,
      kind: 'active',
      appName: 'slack.exe',
      appTitle: '#eu-compliance',
      domain: 'slack.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T13:00:00+05:30',
      endedAt: '2026-08-10T16:20:00+05:30',
      seconds: 12000,
      receivedAt: '2026-08-10T16:21:00+05:30'
    },

    /* ── Amélie Dubois (419) ── */
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000601',
      userId: 419,
      entityId: 2,
      projectId: 96,
      taskId: 1801,
      kind: 'active',
      appName: 'chrome.exe',
      appTitle: 'Zendesk - Ticket Queue',
      domain: 'atlassian.net',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T09:00:00+05:30',
      endedAt: '2026-08-10T11:00:00+05:30',
      seconds: 7200,
      receivedAt: '2026-08-10T11:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000602',
      userId: 419,
      entityId: 2,
      projectId: 96,
      taskId: 1801,
      kind: 'idle',
      appName: '',
      appTitle: 'Away from Desk',
      domain: '',
      clientCategory: 'neutral',
      category: 'neutral',
      startedAt: '2026-08-10T11:00:00+05:30',
      endedAt: '2026-08-10T14:00:00+05:30',
      seconds: 10800,
      receivedAt: '2026-08-10T14:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000603',
      userId: 419,
      entityId: 2,
      projectId: 96,
      taskId: 1801,
      kind: 'active',
      appName: 'slack.exe',
      appTitle: '#cs-eu',
      domain: 'slack.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T14:00:00+05:30',
      endedAt: '2026-08-10T15:55:00+05:30',
      seconds: 6900,
      receivedAt: '2026-08-10T15:56:00+05:30'
    },

    /* ── Hiro Tanaka (420) — APAC ── */
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000701',
      userId: 420,
      entityId: 3,
      projectId: 97,
      taskId: 1901,
      kind: 'active',
      appName: 'chrome.exe',
      appTitle: 'Campaign Dashboard',
      domain: 'github.com',
      clientCategory: 'productive',
      category: 'productive',
      startedAt: '2026-08-10T09:00:00+05:30',
      endedAt: '2026-08-10T11:00:00+05:30',
      seconds: 7200,
      receivedAt: '2026-08-10T11:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000702',
      userId: 420,
      entityId: 3,
      projectId: 97,
      taskId: 1901,
      kind: 'active',
      appName: 'chrome.exe',
      appTitle: 'YouTube Ads Review',
      domain: 'youtube.com',
      clientCategory: 'unproductive',
      category: 'unproductive',
      startedAt: '2026-08-10T11:00:00+05:30',
      endedAt: '2026-08-10T12:00:00+05:30',
      seconds: 3600,
      receivedAt: '2026-08-10T12:01:00+05:30'
    },
    {
      id: 'a1b2c3d4-e001-4000-8000-000000000703',
      userId: 420,
      entityId: 3,
      projectId: 97,
      taskId: 1901,
      kind: 'active',
      appName: 'slack.exe',
      appTitle: '#growth-apac',
      domain: 'slack.com',
      clientCategory: 'neutral',
      category: 'neutral',
      startedAt: '2026-08-10T13:00:00+05:30',
      endedAt: '2026-08-10T14:10:00+05:30',
      seconds: 4200,
      receivedAt: '2026-08-10T14:11:00+05:30'
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
      capturedAt: '2026-08-10T10:00:00+05:30',
      width: 1697,
      height: 955,
      monitors: 2,
      bytes: 168432,
      duringIdle: false,
      blurred: false,
      receivedAt: '2026-08-10T10:00:05+05:30'
    },
    {
      id: '4b21c3d4-e001-4000-8000-000000000002',
      userId: 412,
      entityId: 1,
      projectId: 88,
      taskId: 1204,
      capturedAt: '2026-08-10T10:40:00+05:30',
      width: 1697,
      height: 955,
      monitors: 2,
      bytes: 152100,
      duringIdle: false,
      blurred: false,
      receivedAt: '2026-08-10T10:40:04+05:30'
    },
    {
      id: '4b21c3d4-e001-4000-8000-000000000003',
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
      id: '4b21c3d4-e001-4000-8000-000000000004',
      userId: 412,
      entityId: 1,
      projectId: 88,
      taskId: 1204,
      capturedAt: '2026-08-10T15:20:00+05:30',
      width: 1697,
      height: 955,
      monitors: 2,
      bytes: 171000,
      duringIdle: false,
      blurred: false,
      receivedAt: '2026-08-10T15:20:02+05:30'
    },
    {
      id: '4b21c3d4-e001-4000-8000-000000000005',
      userId: 413,
      entityId: 1,
      projectId: 90,
      taskId: 1301,
      capturedAt: '2026-08-10T09:30:00+05:30',
      width: 1920,
      height: 1080,
      monitors: 1,
      bytes: 198000,
      duringIdle: false,
      blurred: false,
      receivedAt: '2026-08-10T09:30:03+05:30'
    },
    {
      id: '4b21c3d4-e001-4000-8000-000000000006',
      userId: 413,
      entityId: 1,
      projectId: 90,
      taskId: 1301,
      capturedAt: '2026-08-10T12:45:00+05:30',
      width: 1920,
      height: 1080,
      monitors: 1,
      bytes: 195000,
      duringIdle: false,
      blurred: false,
      receivedAt: '2026-08-10T12:45:02+05:30'
    },
    {
      id: '4b21c3d4-e001-4000-8000-000000000007',
      userId: 413,
      entityId: 1,
      projectId: 90,
      taskId: 1301,
      capturedAt: '2026-08-10T15:10:00+05:30',
      width: 1920,
      height: 1080,
      monitors: 1,
      bytes: 210000,
      duringIdle: false,
      blurred: true,
      receivedAt: '2026-08-10T15:10:04+05:30'
    },
    {
      id: '4b21c3d4-e001-4000-8000-000000000008',
      userId: 414,
      entityId: 1,
      projectId: 91,
      taskId: 1401,
      capturedAt: '2026-08-10T09:30:00+05:30',
      width: 1920,
      height: 1080,
      monitors: 1,
      bytes: 160000,
      duringIdle: false,
      blurred: false,
      receivedAt: '2026-08-10T09:30:02+05:30'
    },
    {
      id: '4b21c3d4-e001-4000-8000-000000000009',
      userId: 414,
      entityId: 1,
      projectId: 91,
      taskId: 1401,
      capturedAt: '2026-08-10T14:00:00+05:30',
      width: 1920,
      height: 1080,
      monitors: 1,
      bytes: 142000,
      duringIdle: false,
      blurred: false,
      receivedAt: '2026-08-10T14:00:03+05:30'
    },
    {
      id: '4b21c3d4-e001-4000-8000-00000000000a',
      userId: 414,
      entityId: 1,
      projectId: 91,
      taskId: 1401,
      capturedAt: '2026-08-10T15:30:00+05:30',
      width: 1920,
      height: 1080,
      monitors: 1,
      bytes: 98000,
      duringIdle: true,
      blurred: false,
      receivedAt: '2026-08-10T15:30:02+05:30'
    },
    {
      id: '4b21c3d4-e001-4000-8000-00000000000b',
      userId: 415,
      entityId: 1,
      projectId: 88,
      taskId: 1501,
      capturedAt: '2026-08-10T10:00:00+05:30',
      width: 1920,
      height: 1080,
      monitors: 2,
      bytes: 188000,
      duringIdle: false,
      blurred: false,
      receivedAt: '2026-08-10T10:00:04+05:30'
    },
    {
      id: '4b21c3d4-e001-4000-8000-00000000000c',
      userId: 415,
      entityId: 1,
      projectId: 88,
      taskId: 1501,
      capturedAt: '2026-08-10T14:00:00+05:30',
      width: 1920,
      height: 1080,
      monitors: 2,
      bytes: 175000,
      duringIdle: false,
      blurred: false,
      receivedAt: '2026-08-10T14:00:03+05:30'
    },
    {
      id: '4b21c3d4-e001-4000-8000-00000000000d',
      userId: 417,
      entityId: 1,
      projectId: 88,
      taskId: 1601,
      capturedAt: '2026-08-10T10:20:00+05:30',
      width: 2560,
      height: 1440,
      monitors: 1,
      bytes: 220000,
      duringIdle: false,
      blurred: false,
      receivedAt: '2026-08-10T10:20:02+05:30'
    },
    {
      id: '4b21c3d4-e001-4000-8000-00000000000e',
      userId: 417,
      entityId: 1,
      projectId: 88,
      taskId: 1601,
      capturedAt: '2026-08-10T14:00:00+05:30',
      width: 2560,
      height: 1440,
      monitors: 1,
      bytes: 205000,
      duringIdle: false,
      blurred: false,
      receivedAt: '2026-08-10T14:00:04+05:30'
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
      idleSeconds: 5040,
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
      idleSeconds: 2700,
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
      idleSeconds: 15960,
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
      idleSeconds: 2700,
      approvalStatus: 'Approved'
    },
    {
      userId: 418,
      entityId: 2,
      workDate: '2026-08-10',
      projectName: 'EU Compliance',
      taskDescription: 'GDPR Audit Automation',
      startTime: '09:00:00',
      endTime: '17:00:00',
      hoursWorked: 8,
      idleSeconds: 3600,
      approvalStatus: 'Approved'
    },
    {
      userId: 419,
      entityId: 2,
      workDate: '2026-08-10',
      projectName: 'EU Onboarding',
      taskDescription: 'Customer Success Ticket Triage',
      startTime: '09:00:00',
      endTime: '16:00:00',
      hoursWorked: 7,
      idleSeconds: 10800,
      approvalStatus: 'Under Review'
    },
    {
      userId: 420,
      entityId: 3,
      workDate: '2026-08-10',
      projectName: 'Growth Q3',
      taskDescription: 'APAC Campaign Analytics',
      startTime: '09:00:00',
      endTime: '14:00:00',
      hoursWorked: 5,
      idleSeconds: 0,
      approvalStatus: 'Pending'
    },
    {
      userId: 416,
      entityId: 3,
      workDate: '2026-08-10',
      projectName: 'Growth Q3',
      taskDescription: 'Social Ads Creative Review',
      startTime: '09:00:00',
      endTime: '13:00:00',
      hoursWorked: 4,
      idleSeconds: null,
      approvalStatus: 'Pending'
    }
  ];

  /** Weekly productivity rollup for §1.7 / §3.3 dashboards */
  const PRODUCTIVITY_ROLLUP = {
    team: 'Core Engineering',
    weekLabel: '04/08/2026 - 10/08/2026',
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

  (function seedExtraStaticData() {
    const palette = [
      'background: #dbeafe; color: #1d4ed8;',
      'background: #fce7f3; color: #be185d;',
      'background: #fef3c7; color: #b45309;',
      'background: #e0e7ff; color: #4338ca;',
      'background: #dcfce7; color: #15803d;',
      'background: #fae8ff; color: #86198f;',
      'background: #cffafe; color: #0e7490;',
      'background: #ffedd5; color: #c2410c;',
      'background: #f1f5f9; color: #334155;',
      'background: #fee2e2; color: #b91c1c;'
    ];

    const extras = [
      { name: 'Rahul Mehta', team: 'Core Engineering', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Neha Kapoor', team: 'Core Engineering', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Vikram Singh', team: 'Core Engineering', project: 'Cloud Migration', entityId: 1, status: 'idle' },
      { name: 'Ananya Iyer', team: 'Core Engineering', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Rohit Desai', team: 'Core Engineering', project: 'Cloud Migration', entityId: 1, status: 'active' },
      { name: 'Kavya Nair', team: 'Product & UI/UX', project: 'Mobile Redesign', entityId: 1, status: 'active' },
      { name: 'Arjun Patel', team: 'Product & UI/UX', project: 'Mobile Redesign', entityId: 1, status: 'idle' },
      { name: 'Meera Joshi', team: 'Product & UI/UX', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Siddharth Rao', team: 'Quality Assurance', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Pooja Kulkarni', team: 'Quality Assurance', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Nikhil Verma', team: 'Quality Assurance', project: 'Cloud Migration', entityId: 1, status: 'offline' },
      { name: 'Ishita Bansal', team: 'Core Engineering', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Karthik Reddy', team: 'Core Engineering', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Divya Menon', team: 'Product & UI/UX', project: 'Mobile Redesign', entityId: 1, status: 'active' },
      { name: 'Aman Gupta', team: 'Core Engineering', project: 'Cloud Migration', entityId: 1, status: 'idle' },
      { name: 'Sneha Pillai', team: 'Quality Assurance', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Harsh Vardhan', team: 'Core Engineering', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Riya Malhotra', team: 'Product & UI/UX', project: 'Mobile Redesign', entityId: 1, status: 'offline' },
      { name: 'Aditya Chauhan', team: 'Core Engineering', project: 'Cloud Migration', entityId: 1, status: 'active' },
      { name: 'Tanvi Shah', team: 'Quality Assurance', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Manish Agarwal', team: 'Core Engineering', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Shreya Bhatt', team: 'Product & UI/UX', project: 'Mobile Redesign', entityId: 1, status: 'idle' },
      { name: 'Yash Thakur', team: 'Core Engineering', project: 'Cloud Migration', entityId: 1, status: 'active' },
      { name: 'Nisha Goyal', team: 'Quality Assurance', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Kunal Bhatt', team: 'Core Engineering', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Aisha Khan', team: 'Product & UI/UX', project: 'Mobile Redesign', entityId: 1, status: 'active' },
      { name: 'Pranav Kulkarni', team: 'Core Engineering', project: 'Cloud Migration', entityId: 1, status: 'idle' },
      { name: 'Leela Krishnan', team: 'Quality Assurance', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Saurabh Jain', team: 'Core Engineering', project: 'Obelisk ERP', entityId: 1, status: 'offline' },
      { name: 'Fatima Sheikh', team: 'Product & UI/UX', project: 'Mobile Redesign', entityId: 1, status: 'active' },
      { name: 'Devansh Parekh', team: 'Core Engineering', project: 'Cloud Migration', entityId: 1, status: 'active' },
      { name: 'Monica Dsouza', team: 'Quality Assurance', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Abhishek Nanda', team: 'Core Engineering', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Pallavi Deshmukh', team: 'Product & UI/UX', project: 'Mobile Redesign', entityId: 1, status: 'idle' },
      { name: 'Ritesh Kumar', team: 'Core Engineering', project: 'Cloud Migration', entityId: 1, status: 'active' },
      { name: 'Simran Kaur', team: 'Quality Assurance', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Varun Sethi', team: 'Core Engineering', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Chitra Raman', team: 'Product & UI/UX', project: 'Mobile Redesign', entityId: 1, status: 'active' },
      { name: 'Gaurav Bansal', team: 'Core Engineering', project: 'Cloud Migration', entityId: 1, status: 'offline' },
      { name: 'Anjali Sinha', team: 'Quality Assurance', project: 'Obelisk ERP', entityId: 1, status: 'active' },
      { name: 'Lukas Weber', team: 'Platform Ops', project: 'EU Compliance', entityId: 2, status: 'active' },
      { name: 'Sofia Ricci', team: 'Platform Ops', project: 'EU Compliance', entityId: 2, status: 'idle' },
      { name: 'Noah Andersen', team: 'Customer Success', project: 'EU Onboarding', entityId: 2, status: 'active' },
      { name: 'Ines Moreau', team: 'Customer Success', project: 'EU Onboarding', entityId: 2, status: 'active' },
      { name: 'Mateusz Kowalski', team: 'Platform Ops', project: 'EU Compliance', entityId: 2, status: 'offline' },
      { name: 'Clara Jensen', team: 'Customer Success', project: 'EU Onboarding', entityId: 2, status: 'active' },
      { name: 'Felix Bauer', team: 'Platform Ops', project: 'EU Compliance', entityId: 2, status: 'active' },
      { name: 'Helena Novak', team: 'Customer Success', project: 'EU Onboarding', entityId: 2, status: 'idle' },
      { name: 'Wei Chen', team: 'Digital Marketing', project: 'Growth Q3', entityId: 3, status: 'active' },
      { name: 'Mei Lin', team: 'Digital Marketing', project: 'Growth Q3', entityId: 3, status: 'active' },
      { name: 'Kenji Sato', team: 'Digital Marketing', project: 'Growth Q3', entityId: 3, status: 'idle' },
      { name: 'Aiko Nakamura', team: 'Digital Marketing', project: 'Growth Q3', entityId: 3, status: 'active' },
      { name: 'Minho Park', team: 'Digital Marketing', project: 'Growth Q3', entityId: 3, status: 'offline' },
      { name: 'Siti Rahman', team: 'Digital Marketing', project: 'Growth Q3', entityId: 3, status: 'active' }
    ];

    const apps = [
      { appName: 'code.exe', appTitle: 'src — Obelisk ERP', domain: 'github.com', kind: 'active', category: 'productive' },
      { appName: 'cursor.exe', appTitle: 'feature-branch — Monitoring', domain: 'github.com', kind: 'active', category: 'productive' },
      { appName: 'slack.exe', appTitle: '#team-chat — Obelisk', domain: 'slack.com', kind: 'active', category: 'productive' },
      { appName: 'figma.exe', appTitle: 'Design System', domain: 'figma.com', kind: 'active', category: 'productive' },
      { appName: 'chrome.exe', appTitle: 'YouTube', domain: 'youtube.com', kind: 'active', category: 'unproductive' },
      { appName: 'teams.exe', appTitle: 'Standup — Obelisk', domain: 'teams.microsoft.com', kind: 'active', category: 'productive' }
    ];

    const tasks = {
      'Obelisk ERP': 'Feature implementation & code review',
      'Cloud Migration': 'Infrastructure rollout',
      'Mobile Redesign': 'UI kit and prototype updates',
      'EU Compliance': 'GDPR control mapping',
      'EU Onboarding': 'Customer onboarding checklist',
      'Growth Q3': 'Campaign performance review'
    };

    const tz = { 1: '+05:30', 2: '+01:00', 3: '+09:00' };
    const existingIds = new Set(EMPLOYEES.map((e) => e.id));
    let nextId = 421;
    let segSeq = 500;
    let shotSeq = 500;

    function pad(n) {
      return String(n).padStart(2, '0');
    }

    function uuid(prefix, n) {
      return prefix + '-e001-4000-8000-' + String(n).padStart(12, '0');
    }

    extras.forEach(function (person, index) {
      while (existingIds.has(nextId)) {
        nextId += 1;
      }

      const id = nextId;
      nextId += 1;
      existingIds.add(id);

      const parts = person.name.split(' ');
      const initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      const email = person.name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '') + '@obelisk.io';
      const offset = tz[person.entityId] || '+05:30';
      const minute = pad((index * 3) % 50);
      const hour = person.status === 'offline' ? '13' : person.status === 'idle' ? '15' : '16';
      const lastReceivedAt = '2026-08-10T' + hour + ':' + minute + ':00' + offset;

      EMPLOYEES.push({
        id: id,
        entityId: person.entityId,
        name: person.name,
        email: email,
        initials: initials,
        avatarStyle: palette[index % palette.length],
        team: person.team,
        project: person.project,
        status: person.status,
        lastReceivedAt: lastReceivedAt
      });

      const consentRoll = index % 9;
      USER_CONSENT.push({
        userId: id,
        entityId: person.entityId,
        consentedAt: consentRoll === 0 ? null : '2026-0' + (1 + (index % 6)) + '-' + pad(10 + (index % 18)) + 'T10:00:00' + offset,
        consentVersion: 'v1.0',
        revokedAt: consentRoll === 1 ? '2026-07-' + pad(5 + (index % 20)) + 'T14:00:00' + offset : null
      });

      const idleMap = { active: 1800 + (index % 8) * 300, idle: 7200 + (index % 5) * 600, offline: null };
      const hoursMap = { active: 8, idle: 7, offline: 4 };
      const statusMap = { active: 'Approved', idle: 'Under Review', offline: 'Pending' };

      TIMESHEETS.push({
        userId: id,
        entityId: person.entityId,
        workDate: '2026-08-10',
        projectName: person.project,
        taskDescription: tasks[person.project] || 'Daily tracked work',
        startTime: '09:00:00',
        endTime: person.status === 'offline' ? '13:00:00' : '17:00:00',
        hoursWorked: hoursMap[person.status],
        idleSeconds: idleMap[person.status],
        approvalStatus: statusMap[person.status]
      });

      if (person.status === 'offline') {
        return;
      }

      const dayApps = [
        apps[index % apps.length],
        apps[(index + 2) % apps.length],
        { appName: '', appTitle: 'Away from Desk', domain: '', kind: 'idle', category: 'neutral' },
        apps[(index + 4) % apps.length]
      ];

      let cursor = 9;

      dayApps.forEach(function (app, sIndex) {
        const startH = cursor;
        const durH = sIndex === 2 ? 0 : 1;
        const durM = sIndex === 2 ? 18 : 45;
        const endH = startH + durH;
        const endM = durM;
        const seconds = durH * 3600 + durM * 60;
        cursor = endH;

        ACTIVITY_SEGMENTS.push({
          id: uuid('a1b2c3d4', segSeq),
          userId: id,
          entityId: person.entityId,
          projectId: person.project === 'Mobile Redesign' ? 90 : 88,
          taskId: 1200 + (index % 40),
          kind: app.kind,
          appName: app.appName,
          appTitle: app.appTitle,
          domain: app.domain,
          clientCategory: app.category,
          category: app.category,
          startedAt: '2026-08-10T' + pad(startH) + ':00:00' + offset,
          endedAt: '2026-08-10T' + pad(endH) + ':' + pad(endM) + ':00' + offset,
          seconds: seconds,
          receivedAt: '2026-08-10T' + pad(endH) + ':' + pad(endM + 1) + ':00' + offset
        });
        segSeq += 1;
      });

      [10, 14].forEach(function (shotHour, sIndex) {
        SCREENSHOTS.push({
          id: uuid('4b21c3d4', shotSeq),
          userId: id,
          entityId: person.entityId,
          projectId: person.project === 'Mobile Redesign' ? 90 : 88,
          taskId: 1200 + (index % 40),
          capturedAt: '2026-08-10T' + pad(shotHour) + ':' + pad(15 + sIndex * 10) + ':00' + offset,
          width: 1697,
          height: 955,
          monitors: 1 + (index % 2),
          bytes: 140000 + index * 850,
          duringIdle: person.status === 'idle' && sIndex === 1,
          blurred: index % 11 === 0,
          receivedAt: '2026-08-10T' + pad(shotHour) + ':' + pad(15 + sIndex * 10) + ':04' + offset
        });
        shotSeq += 1;
      });
    });
  })();

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
