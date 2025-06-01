import { Router } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';

export function dashboardRoutes(supabase: SupabaseClient): Router {
  const router = Router();

  router.get('/dora-metrics', async (_req, res) => {
    const { data, error } = await supabase.from('dora_metrics').select('*');
    if (error) return res.status(500).json({ error });
    res.json(data ?? []);
  });

  return router;
}
