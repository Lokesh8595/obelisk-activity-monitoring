import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          dashboard: path.resolve(__dirname, 'dashboard.html'),
          employeeTimeline: path.resolve(__dirname, 'employee-timeline.html'),
          activity: path.resolve(__dirname, 'activity.html'),
          screenshots: path.resolve(__dirname, 'screenshots.html'),
          productivity: path.resolve(__dirname, 'productivity.html'),
          timesheets: path.resolve(__dirname, 'timesheets.html'),
          monitoringSettings: path.resolve(__dirname, 'monitoring-settings.html'),
          productivityRules: path.resolve(__dirname, 'productivity-rules.html'),
          consentManagement: path.resolve(__dirname, 'consent-management.html'),
          employeeDetail: path.resolve(__dirname, 'employee-detail.html'),
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
