import express from 'express';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { createClient } from '@supabase/supabase-js';

import { dashboardRoutes } from './routes/dashboard';
import { productRoutes } from './routes/product';
import { serviceRoutes } from './routes/service';

type RouterOptions = {
  logger: LoggerService;
  config: Config;
};

export async function createRouter({ logger, config }: RouterOptions): Promise<express.Router> {
  const supabaseUrl = config.getString('statora.supabase.url');
  const supabaseKey = config.getString('statora.supabase.serviceRoleKey');
  const supabase = createClient(supabaseUrl, supabaseKey);

  const router = express.Router();

  router.use(dashboardRoutes(supabase));
  router.use(productRoutes(supabase));
  router.use(serviceRoutes(supabase));

  return router;
}
