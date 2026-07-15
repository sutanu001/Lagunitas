import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * HeroSection — full-viewport hero with parallax bottle and background text.
 */
const HeroSection = ({ product }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const bottleY    = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const bgTextY    = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const bgTextOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY   = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section id="hero" className="hero noise-overlay" ref={ref} style={{ minHeight: '100svh' }}>
      {/* Background watermark text */}
      <motion.div
        className="hero__bg-text"
        style={{ y: bgTextY, opacity: bgTextOpacity }}
        aria-hidden="true"
      >
        <span style={{ paddingLeft: '2vw' }}>UNLIMITED</span>
        <span style={{ paddingLeft: '8vw', WebkitTextStroke: '2px rgba(196,30,58,0.18)' }}>
          RELEASE
        </span>
        <span style={{ paddingLeft: '1vw' }}>INDIA</span>
        <span style={{ paddingLeft: '12vw' }}>PALE</span>
        <span style={{ paddingLeft: '4vw' }}>ALE</span>
      </motion.div>

      {/* Foreground content */}
      <motion.div className="hero__content" style={{ y: contentY }}>
        <p className="hero__eyebrow">Lagunitas Brewing Company</p>

        <h1 style={{ marginBottom: 0 }}>
          <motion.span
            className="hero__title-line"
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 4.5rem)',
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
              fontStyle: 'italic',
              color: 'var(--text-muted)',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {product?.tagline || 'Unlimited Release'}
          </motion.span>

          <motion.span
            className="hero__title-line"
            style={{
              fontSize: 'clamp(4rem, 13vw, 14rem)',
              color: 'var(--red)',
              lineHeight: '0.88',
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9 }}
          >
            IPA
          </motion.span>

          <motion.span
            className="hero__title-line"
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 2.2rem)',
              color: 'var(--charcoal)',
              letterSpacing: '0.45em',
              marginTop: '0.5rem',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            INDIA PALE ALE
          </motion.span>
        </h1>

        {/* Floating bottle — real PNG asset */}
        <motion.div
          className="hero__bottle-wrap float-anim"
          style={{ y: bottleY, filter: 'drop-shadow(0 40px 60px rgba(26,18,8,0.28))' }}
          initial={{ opacity: 0, scale: 0.8, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <img
            src="/bottle.png"
            alt="Lagunitas IPA bottle"
            style={{
              height: 'clamp(280px, 40vh, 420px)',
              width: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'multiply',
            }}
          />
        </motion.div>

        {/* Stats strip */}
        <motion.div
          style={{
            display: 'flex',
            gap: 'clamp(1.5rem, 4vw, 4rem)',
            alignItems: 'center',
            marginTop: '2rem',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          {[
            { val: product?.abv ?? '6.2', unit: '%', label: 'ABV' },
            { val: product?.ibu ?? '51.1', unit: '', label: 'IBU' },
            { val: product?.og  ?? '1.059', unit: '', label: 'OG' },
          ].map(({ val, unit, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.4rem, 3vw, 2.5rem)',
                fontWeight: 900,
                color: 'var(--black)',
                lineHeight: 1,
              }}>
                {val}{unit}
              </div>
              <div className="label text-muted" style={{ marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <div className="hero__scroll-hint">
        <div className="hero__scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
};

export default HeroSection;
