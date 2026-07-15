import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/** Map container type to its real PNG image */
const CONTAINER_IMAGES = {
  'On Tap':      '/tap-handle.png',
  '22oz Bottle': '/bottle-22oz.png',
  '12oz Bottle': '/bottle-12oz.png',
  '12oz Can':    '/can-12oz.png',
  '19.2oz Can':  '/can-19oz.png',
};

const AvailabilitySection = ({ product }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const titleX = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  const items = product?.availability || [
    { type: 'On Tap',      label: 'DRAFT' },
    { type: '22oz Bottle', label: 'SINGLE' },
    { type: '12oz Bottle', label: '6- OR 12-PACK' },
    { type: '12oz Can',    label: '6- OR 12-PACK' },
    { type: '19.2oz Can',  label: 'SINGLE' },
  ];

  return (
    <section id="availability" className="availability noise-overlay" ref={ref}>
      {/* Header */}
      <div className="availability__header">
        <div>
          <p className="availability__eyebrow">Formats</p>
          <motion.h2
            className="availability__title"
            style={{ x: titleX }}
          >
            Year<br />Round
          </motion.h2>
        </div>
        <p style={{ maxWidth: '360px', fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, alignSelf: 'flex-end' }}>
          Lagunitas IPA is available wherever great beer is sold — all year,
          every year, in every format your heart desires.
        </p>
      </div>

      {/* Containers */}
      <div className="availability__grid">
        {items.map((item, i) => (
          <motion.div
            key={item.type}
            className="avail-item"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <div className="avail-item__icon-wrap">
              <img
                src={CONTAINER_IMAGES[item.type] || '/bottle.png'}
                alt={item.type}
                style={{
                  height: item.type === 'On Tap' ? '130px' : '120px',
                  width: 'auto',
                  objectFit: 'contain',
                  mixBlendMode: 'multiply',
                  filter: 'drop-shadow(0 8px 16px rgba(26,18,8,0.15))',
                }}
              />
            </div>
            <p className="avail-item__type">{item.type}</p>
            {item.label && <p className="avail-item__label">{item.label}</p>}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AvailabilitySection;
