import {
  createPlugin,
  createRoutableExtension,
  createRouteRef,
} from '@backstage/core-plugin-api';

// Define your route refs
export const rootRouteRef = createRouteRef({
  id: 'statora-root',
});

export const serviceRouteRef = createRouteRef({
  id: 'statora-service',
});

// Create the plugin
export const statoraPlugin = createPlugin({
  id: 'statora',
  routes: {
    root: rootRouteRef,
    service: serviceRouteRef,
  },
});

// Dashboard view
export const DashboardPage = statoraPlugin.provide(
  createRoutableExtension({
    name: 'DashboardPage',
    component: () =>
      import('./pages/DashboardPage').then(m => m.DashboardPage),
    mountPoint: rootRouteRef,
  }),
);

// Entity detail page view
export const EntityStatoraContent = statoraPlugin.provide(
  createRoutableExtension({
    name: 'StatoraServiceDetailPage',
    component: () =>
      import('./pages/ServiceDetailPage').then(m => m.ServiceDetailPage),
    mountPoint: serviceRouteRef,
  }),
);
