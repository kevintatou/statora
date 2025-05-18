// plugins/catalog-backend-module-statora-supabase/src/module.ts
import { createBackendModule, coreServices } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha'; // <-- note “/alpha”
import { SupabaseEntityProvider } from './SupabaseEntityProvider';

export function catalogModuleStatora() {
  return createBackendModule({
    pluginId: 'catalog',
    moduleId: 'statora-supabase',
    register(env) {
      env.registerInit({
        deps: {
          config: coreServices.rootConfig,
          catalog: catalogProcessingExtensionPoint,
        },
        async init({ config, catalog }) {
          const provider = new SupabaseEntityProvider(config);
          catalog.addEntityProvider(provider);
        },
      });
    },
  });
}
