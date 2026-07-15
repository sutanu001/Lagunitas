import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * MouthfeelsSection — large "MOUTHFEELS" text, brewmaster quote, tasting notes.
 */
const MouthfeelsSection = ({ product }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bigTextX = useTransform(scrollYProgress, [0, 1], ['-8%', '4%']);

  return (
    <section id="mouthfeels" className="mouthfeels" ref={ref}>
      {/* ── Big parallax title ── */}
      <motion.div
        className="mouthfeels__header"
        style={{ x: bigTextX }}
        aria-hidden="true"
      >
        <div className="mouthfeels__big-text">MOUTH</div>
        <div
          className="mouthfeels__big-text"
          style={{ color: 'var(--red)', WebkitTextStroke: '2px var(--red)' }}
        >
          FEELS
        </div>
      </motion.div>

      {/* ── Content grid ── */}
      <div className="mouthfeels__grid">
        {/* Brewmaster quote card */}
        <motion.div
          className="brewmaster-card"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="brewmaster-card__quote">
            "This is the beer that put us on the map. We set out to make something
            hop-forward but still dangerously drinkable. I think we nailed it.
            The citrus and pine from the hops, balanced by that caramel malt backbone —
            it just works, man."
          </p>
          <p className="brewmaster-card__byline">
            — Jeremy Marshall, Head Brewmaster
          </p>

          {/* Decorative red line */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, var(--red), transparent)',
          }} />
        </motion.div>

        {/* Mouthfeel description */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="label text-red" style={{ marginBottom: '1.5rem' }}>
            Tasting Notes
          </p>

          <p className="mouthfeels__desc">
            {product?.mouthfeel ||
              "A well-rounded, highly drinkable IPA packed with 'C-word' hops and rounded out with some simcoe. The taste is a clean mix of refreshing citrus, sweet caramel and pleasant bitterness. Lagunitas IPA has a light orange body, a long lasting head, a full bodied aroma, and a nice sharp hop finish."}
          </p>

          {/* Sensory dial bars */}
          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { attr: 'Bitterness',  pct: 65, color: 'var(--red)' },
              { attr: 'Sweetness',   pct: 35, color: 'var(--gold)' },
              { attr: 'Aroma',       pct: 80, color: 'var(--black)' },
              { attr: 'Drinkability',pct: 90, color: 'var(--red)' },
            ].map(({ attr, pct, color }) => (
              <div key={attr}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.35rem',
                }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    {attr}
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color }}>
                    {pct}%
                  </span>
                </div>
                <div style={{ height: '4px', background: 'var(--cream-darker, #d8d0bf)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', background: color, borderRadius: '2px' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MouthfeelsSection;
