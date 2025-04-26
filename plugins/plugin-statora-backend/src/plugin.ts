import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';

export const statoraPlugin = createBackendPlugin({
  pluginId: 'statora-backend',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        httpRouter: coreServices.httpRouter,
      },
      async init({ logger, config, httpRouter }) {
        const router = await createRouter({ logger, config });
        httpRouter.use(router);
        logger.info('✅ Statora router initialized');
      },
    });
  },
});
