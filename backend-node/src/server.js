import express       from 'express';
import cors          from 'cors';
import helmet        from 'helmet';
import morgan        from 'morgan';
import compression   from 'compression';
import rateLimit     from 'express-rate-limit';
import dotenv        from 'dotenv';
import axios         from 'axios';

import productRoutes from './routes/products.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB }    from './config/database.js';

dotenv.config();

const app  = express();
const PORT = parseInt(process.env.PORT || '5000');
const PYTHON_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';

// ─── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods:     ['GET', 'POST', 'OPTIONS'],
}));

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs:         15 * 60 * 1000, // 15 min
  max:              200,
  standardHeaders:  true,
  legacyHeaders:    false,
  message:          { error: 'Too many requests. Please try again later.' },
});
app.use('/api/', apiLimiter);

// ─── Body / Logging / Compression ─────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(compression());

// ─── Database ─────────────────────────────────────────────────────────────────
await connectDB();

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status:    'OK',
    service:   'lagunitas-node-api',
    timestamp: new Date().toISOString(),
    version:   '1.0.0',
  });
});

// Products
app.use('/api/product', productRoutes);

// Proxy → Python ML service (recommendations)
app.get('/api/recommendations', async (req, res, next) => {
  try {
    const { data } = await axios.get(`${PYTHON_URL}/recommendations`, {
      params:  req.query,
      timeout: 5000,
    });
    res.json(data);
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.code === 'ERR_BAD_REQUEST') {
      return res.status(503).json({ error: 'ML service temporarily unavailable.' });
    }
    next(err);
  }
});

// Proxy → Python analytics endpoint
app.get('/api/analytics/popular', async (req, res, next) => {
  try {
    const { data } = await axios.get(`${PYTHON_URL}/analytics/popular`, { timeout: 5000 });
    res.json(data);
  } catch {
    // Return mock data if Python service is down
    res.json({
      most_viewed: [
        { beer_id: 1, name: 'IPA',                       views: 15_420 },
        { beer_id: 2, name: "Little Sumpin' Sumpin'",    views:  8_930 },
      ],
      trending_flavors:     ['citrus', 'hoppy', 'caramel'],
      seasonal_preference:  'year_round',
    });
  }
});

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(errorHandler);

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Lagunitas Node.js API  →  http://localhost:${PORT}`);
  console.log(`    Python ML service      →  ${PYTHON_URL}`);
  console.log(`    Environment            →  ${process.env.NODE_ENV || 'development'}`);
});

export default app;
