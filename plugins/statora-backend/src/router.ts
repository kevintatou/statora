import express from 'express';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { createClient } from '@supabase/supabase-js';

type RouterOptions = {
  logger: LoggerService;
  config: Config;
};

export async function createRouter( options: RouterOptions): Promise<express.Router> {
  const { logger, config } = options;

  const supabaseUrl = config.getString('statora.supabase.url');
  const supabaseKey = config.getString('statora.supabase.serviceRoleKey');

  const supabase = createClient(supabaseUrl, supabaseKey);
  const router = express.Router();
  router.get('/hello', async (_req, res) => {
    res.json({ message: 'Hello from backend!' });
  });
  // Publicly available routes (no auth middleware)
  router.get('/components', async (_req, res) => {
    const { data, error } = await supabase.from('components').select('*');
    if (error) return res.status(500).json({ error });
    res.json(data ?? []);
  });

  router.get('/dora-metrics', async (_req, res) => {
    const { data, error } = await supabase.from('dora_metrics').select('*');
    if (error) return res.status(500).json({ error });
    res.json(data ?? []);
  });

  router.get('/products/:name/components', async (req, res) => {
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

  return router;
}
