import express from 'express';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { createClient } from '@supabase/supabase-js';

type RouterOptions = {
  logger: LoggerService;
  config: Config;
};
console.log("✅ router.ts LOADED");

export async function createRouter({ logger, config }: RouterOptions): Promise<express.Router> {
  const supabaseUrl = config.getString('statora.supabase.url');
  const supabaseKey = config.getString('statora.supabase.serviceRoleKey');
  const supabase = createClient(supabaseUrl, supabaseKey);

  const subRouter = express.Router();
  subRouter.stack.forEach(layer => {
    if (layer.route) {
      console.log('✅ Route registered:', layer.route.path);
    }
  });
  
  // Health check or test endpoint
  subRouter.get('/hello', async (_req, res) => {
    res.json({ message: 'Hello from Statora backend!' });
  });

  // Components endpoint
  subRouter.get('/components', async (_req, res) => { 
    const { data, error } = await supabase.from('components').select('*');
    if (error) return res.status(500).json({ error });
    res.json(data ?? []);
  });

  // DORA metrics endpoint
  subRouter.get('/dora-metrics', async (_req, res) => {
    const { data, error } = await supabase.from('dora_metrics').select('*');
    if (error) return res.status(500).json({ error });
    res.json(data ?? []);
  });

  // Components filtered by product name
  subRouter.get('/products/:name/components', async (req, res) => {
    const { name } = req.params;
    let query = supabase.from('components').select('*');

    if (name === 'Unassigned') {
      query = query.or('product_name.is.null,product_name.eq.""');
    } else {
      query = query.eq('product_name', name);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error });
    res.json(data ?? []);
  });

  // Mount everything under /statora-backend
  return subRouter;
}
