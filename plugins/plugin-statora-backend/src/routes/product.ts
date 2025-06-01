import { Router } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';

export function productRoutes(supabase: SupabaseClient): Router {
  const router = Router();

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
