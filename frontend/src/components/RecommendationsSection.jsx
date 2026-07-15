import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { mlApi } from '../api/client';

const FALLBACK_RECS = [
  {
    beer: { id: 2, name: "Little Sumpin' Sumpin'", style: 'Pale Wheat Ale', abv: 7.5, ibu: 64.2 },
    similarity_score: 0.87,
    reasoning: 'Shares citrus and hoppy flavor notes',
  },
  {
    beer: { id: 3, name: 'Maximus', style: 'Double IPA', abv: 8.2, ibu: 72.5 },
    similarity_score: 0.79,
    reasoning: 'Shares hoppy, resinous, and pine notes',
  },
  {
    beer: { id: 5, name: 'DayTime', style: 'Fractional IPA', abv: 4.0, ibu: 31.0 },
    similarity_score: 0.68,
    reasoning: 'Shares citrus and light session character',
  },
];

const RecommendationsSection = ({ productId = 1 }) => {
  const [recs,    setRecs]    = useState(FALLBACK_RECS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mlApi
      .getRecommendations(productId, 3)
      .then((data) => {
        if (data?.recommendations?.length) setRecs(data.recommendations);
      })
      .catch(() => {/* keep fallback */})
      .finally(() => setLoading(false));
  }, [productId]);

  return (
    <section id="recommendations" className="recommendations">
      <motion.div
        className="recommendations__header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="recommendations__eyebrow">
          {loading ? 'Computing…' : 'ML-Powered · TF-IDF + Cosine Similarity'}
        </p>
        <h2 className="recommendations__title">You might also like</h2>
      </motion.div>

      <div className="rec-grid">
        {recs.map((rec, i) => (
          <motion.div
            key={rec.beer.id}
            className="rec-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.7 }}
            whileHover={{ y: -5 }}
          >
            <p className="rec-card__style">{rec.beer.style}</p>
            <h3 className="rec-card__name">{rec.beer.name}</h3>

            <div className="rec-card__stats">
              <div className="rec-card__stat">
                <span className="rec-card__stat-val">{rec.beer.abv}%</span>
                <span className="rec-card__stat-lbl">ABV</span>
              </div>
              <div className="rec-card__stat">
                <span className="rec-card__stat-val">{rec.beer.ibu}</span>
                <span className="rec-card__stat-lbl">IBU</span>
              </div>
            </div>

            {/* Similarity score bar */}
            <div className="rec-card__score">
              <motion.div
                className="rec-card__score-fill"
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.round(rec.similarity_score * 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 + i * 0.1 }}
              />
            </div>
            <p className="rec-card__score-lbl">
              {Math.round(rec.similarity_score * 100)}% flavor match
            </p>

            {rec.reasoning && (
              <p className="rec-card__reasoning">{rec.reasoning}</p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RecommendationsSection;
