import { Router } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';

export function serviceRoutes(supabase: SupabaseClient): Router {
  const router = Router();

  // GET all components
  router.get('/components', async (_req, res) => {
    const { data, error } = await supabase.from('components').select('*');
    if (error) return res.status(500).json({ error });
    res.json(data ?? []);
  });

  // GET single component mapping
  router.get('/components/:componentName', async (req, res) => {
    console.log("IN ROUTE")
    const { componentName } = req.params;
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('component_name', componentName)
      .single();

    if (error) return res.status(500).json({ error });
    res.json(data ?? {});
  });

  // PUT update component mapping
  router.put('/components/:componentName', async (req, res) => {
    const { componentName } = req.params;
    const mapping = req.body;

    const { data, error } = await supabase
      .from('components')
      .update(mapping)
      .eq('component_name', componentName)
      .select()
      .single();

    if (error) return res.status(500).json({ error });
    res.json(data);
  });

  // POST create new mapping
  router.post('/components', async (req, res) => {
    const mapping = req.body;
    console.log(mapping)
    const { data, error } = await supabase
      .from('components')
      .insert([mapping])
      .select()
      .single();

    if (error) return res.status(500).json({ error });
    res.json(data);
  });

  return router;
}
