import { Router } from 'express';
import {
  getProductBySlug,
  getAllProducts,
  recordProductView,
  getProductAnalytics,
  getProductPairings,
} from '../controllers/productController.js';

const router = Router();

// GET  /api/product               – list all products
router.get('/',                     getAllProducts);

// GET  /api/product/:slug          – single product detail
router.get('/:slug',                getProductBySlug);

// POST /api/product/:slug/view     – record a page view
router.post('/:slug/view',          recordProductView);

// GET  /api/product/:slug/analytics – view analytics
router.get('/:slug/analytics',      getProductAnalytics);

// GET  /api/product/:slug/pairings  – food pairings (?cuisine=Mexican)
router.get('/:slug/pairings',       getProductPairings);

export default router;
