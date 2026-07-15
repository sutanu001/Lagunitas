import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.75, ease: [0.4, 0, 0.2, 1] },
  }),
};

/**
 * ProductInfoSection — description + buy button on left; stats panel on right.
 */
const ProductInfoSection = ({ product }) => {
  if (!product) return null;

  return (
    <section id="product-info" className="product-info">
      <div className="product-info__grid">
        {/* ── Left column ── */}
        <div className="product-info__left">
          <motion.p
            className="product-info__label"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            Lagunitas Brewing Co. · Petaluma, CA
          </motion.p>

          <motion.p
            className="product-info__slash"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            {product.tagline} /
          </motion.p>

          <motion.h2
            className="product-info__name"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            {product.name}
          </motion.h2>

          <motion.p
            className="product-info__desc"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
          >
            {product.description}
          </motion.p>

          {product.style_desc && (
            <motion.p
              className="product-info__desc"
              style={{ marginBottom: '2.5rem', fontStyle: 'italic', opacity: 0.8 }}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={4}
            >
              {product.style_desc}
            </motion.p>
          )}

          <motion.a
            href="https://lagunitas.com/beers/ipa"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-buy"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={5}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>BUY NOW</span>
            <span style={{ fontSize: '1.1rem' }}>→</span>
          </motion.a>
        </div>

        {/* ── Right column — Stats panel ── */}
        <motion.div
          className="stats-panel"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="stats-panel__title">Beer Facts</p>

          {[
            { label: 'ABV', value: `${product.abv}%`, desc: 'Alcohol by Volume' },
            { label: 'IBU', value: product.ibu,       desc: 'Int\'l Bitterness Units' },
            { label: 'OG',  value: product.og,        desc: 'Original Gravity' },
          ].map(({ label, value, desc }, i) => (
            <motion.div
              key={label}
              className="stat-item"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
            >
              <div className="stat-item__value">{value}</div>
              <div className="stat-item__label">{label} · {desc}</div>
            </motion.div>
          ))}

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.5rem' }}>
              Year-Round Availability
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              On tap · 12oz · 22oz · 19.2oz cans
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductInfoSection;
