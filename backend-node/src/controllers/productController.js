import { query }            from '../config/database.js';
import { PRODUCTS_FALLBACK } from '../config/fallbackData.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Normalise a DB row so JSONB fields are already parsed objects */
const normaliseRow = (row) => {
  if (!row) return null;
  return {
    ...row,
    flavors:      typeof row.flavors      === 'string' ? JSON.parse(row.flavors)      : (row.flavors      ?? []),
    availability: typeof row.availability === 'string' ? JSON.parse(row.availability) : (row.availability ?? []),
  };
};

/** Fire-and-forget analytics insert — never throws */
const recordView = (slug, ip, ua) => {
  query(
    'INSERT INTO product_views (product_slug, ip_address, user_agent) VALUES ($1, $2, $3)',
    [slug, ip, ua],
  ).catch(() => {});
};

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * GET /api/product/:slug
 * Returns a single product by URL slug.
 */
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    let product = null;

    // 1. Try DB
    const result = await query(
      `SELECT p.*,
              COALESCE(
                json_agg(fp.dish_name ORDER BY fp.match_score DESC) FILTER (WHERE fp.dish_name IS NOT NULL),
                '[]'
              ) AS food_pairings
       FROM   products p
       LEFT JOIN food_pairings fp ON fp.product_slug = p.slug
       WHERE  p.slug = $1 AND p.is_active = true
       GROUP  BY p.id`,
      [slug],
    );

    if (result?.rows?.length) {
      product = normaliseRow(result.rows[0]);
    }

    // 2. Fallback
    if (!product) {
      product = PRODUCTS_FALLBACK[slug] ?? null;
    }

    if (!product) {
      return res.status(404).json({ error: `Product "${slug}" not found.` });
    }

    // 3. Analytics (non-blocking)
    recordView(slug, req.ip, req.headers['user-agent']);

    return res.json(product);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/product
 * Returns a list of all active products (summary fields only).
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, slug, name, tagline, abv, ibu, og FROM products WHERE is_active = true ORDER BY id',
    );

    if (result?.rows?.length) {
      return res.json(result.rows);
    }

    // Fallback
    const summary = Object.values(PRODUCTS_FALLBACK).map(
      ({ id, slug, name, tagline, abv, ibu, og }) => ({ id, slug, name, tagline, abv, ibu, og }),
    );
    return res.json(summary);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/product/:slug/view
 * Explicit view-tracking endpoint (e.g., called when user lingers 10 s).
 */
export const recordProductView = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = await query(
      'INSERT INTO product_views (product_slug, ip_address, user_agent) VALUES ($1, $2, $3) RETURNING id',
      [slug, req.ip, req.headers['user-agent']],
    );
    return res.json({ success: true, view_id: result?.rows?.[0]?.id ?? null });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/product/:slug/analytics
 * Returns page-view analytics for a given product.
 */
export const getProductAnalytics = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const result = await query(
      `SELECT
          COUNT(*)                                      AS total_views,
          COUNT(DISTINCT ip_address)                    AS unique_visitors,
          COUNT(*) FILTER (WHERE viewed_at > NOW() - INTERVAL '1 day')  AS views_last_24h,
          COUNT(*) FILTER (WHERE viewed_at > NOW() - INTERVAL '7 days') AS views_last_7d
       FROM product_views
       WHERE product_slug = $1`,
      [slug],
    );

    if (!result?.rows?.length) {
      return res.json({ slug, total_views: 0, unique_visitors: 0, views_last_24h: 0, views_last_7d: 0 });
    }

    return res.json({ slug, ...result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/product/:slug/pairings
 * Returns food pairings for a product, optionally filtered by cuisine.
 */
export const getProductPairings = async (req, res, next) => {
  try {
    const { slug }    = req.params;
    const { cuisine } = req.query;

    let sql    = 'SELECT * FROM food_pairings WHERE product_slug = $1';
    let params = [slug];

    if (cuisine) {
      sql += ' AND LOWER(cuisine_type) = LOWER($2)';
      params.push(cuisine);
    }

    sql += ' ORDER BY match_score DESC';

    const result = await query(sql, params);

    if (result?.rows?.length) {
      return res.json(result.rows);
    }

    // Fallback to embedded data
    const fallback = PRODUCTS_FALLBACK[slug]?.food_pairings ?? [];
    return res.json(fallback.map((dish, i) => ({ id: i + 1, product_slug: slug, dish_name: dish })));
  } catch (err) {
    next(err);
  }
};
