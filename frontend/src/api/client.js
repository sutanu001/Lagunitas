import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Response interceptor — graceful error messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const msg =
      error.response?.data?.error ||
      error.message ||
      'Network error — running with local data.';
    console.warn('[API]', msg);
    return Promise.reject(new Error(msg));
  },
);

export const productApi = {
  /** Fetch all products (summary) */
  getAll: () => api.get('/api/product'),

  /** Fetch single product by slug */
  getBySlug: (slug) => api.get(`/api/product/${slug}`),

  /** Record a view */
  recordView: (slug) => api.post(`/api/product/${slug}/view`),

  /** Get analytics */
  getAnalytics: (slug) => api.get(`/api/product/${slug}/analytics`),

  /** Get food pairings */
  getPairings: (slug, cuisine) =>
    api.get(`/api/product/${slug}/pairings`, { params: cuisine ? { cuisine } : {} }),
};

export const mlApi = {
  /** Get beer recommendations */
  getRecommendations: (beerId, topN = 3) =>
    api.get('/api/recommendations', { params: { beer_id: beerId, top_n: topN } }),

  /** Get popular beers analytics */
  getPopular: () => api.get('/api/analytics/popular'),
};

export default api;
