import { motion } from 'framer-motion';

const PAIRINGS = [
  {
    name: 'Spicy Fish Tacos',
    tag: 'Mexican',
    desc: 'The citrus hops cut through the heat, creating a refreshing contrast with every bite.',
    emoji: '🌮',
    color: '#f5b041',
  },
  {
    name: 'Blue Cheese Burger',
    tag: 'American',
    desc: 'Bold bitterness meets bold blue cheese for the classic IPA combo.',
    emoji: '🍔',
    color: '#e74c3c',
  },
  {
    name: 'Tonkotsu Ramen',
    tag: 'Japanese',
    desc: 'Hoppy bitterness balances the rich, fatty pork broth beautifully.',
    emoji: '🍜',
    color: '#e67e22',
  },
];

const RecipesSection = () => {
  return (
    <section id="recipes" className="recipes">
      {/* Header */}
      <motion.div
        className="recipes__header"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="recipes__eyebrow">Food Pairings</p>
        <h2 className="recipes__title">
          Beer Speaks.
          <br />
          <em style={{ fontStyle: 'italic', color: 'var(--red)' }}>Bellies Grumble.</em>
        </h2>
        <p style={{
          maxWidth: '540px',
          margin: '1.5rem auto 0',
          fontSize: '1rem',
          color: 'var(--text-muted)',
          lineHeight: 1.75,
        }}>
          A well-balanced IPA deserves equally well-balanced food.
          Here are our favourite pairings straight from the brewery kitchen.
        </p>
      </motion.div>

      {/* Pairing cards */}
      <div className="recipes__grid">
        {PAIRINGS.map((pair, i) => (
          <motion.article
            key={pair.name}
            className="recipe-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.13, duration: 0.75 }}
          >
            {/* Colour strip header */}
            <div
              className="recipe-card__img-wrap"
              style={{ background: pair.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <motion.div
                style={{ fontSize: '6rem', lineHeight: 1 }}
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i }}
              >
                {pair.emoji}
              </motion.div>
            </div>

            <div className="recipe-card__body">
              <p className="recipe-card__tag">{pair.tag}</p>
              <h3 className="recipe-card__name">{pair.name}</h3>
              <p className="recipe-card__desc">{pair.desc}</p>

              {/* Match score bar */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Match score
                  </span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--red)' }}>
                    {[95, 92, 88][i]}%
                  </span>
                </div>
                <div style={{ height: '3px', background: 'var(--cream-darker,#ccc)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', background: 'var(--red)', borderRadius: '2px' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${[95, 92, 88][i]}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: 'easeOut', delay: 0.4 + i * 0.1 }}
                  />
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Bottom tagline */}
      <motion.p
        style={{
          textAlign: 'center',
          marginTop: '4rem',
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(1.2rem, 3vw, 2.2rem)',
          color: 'var(--text-muted)',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        "Pairs with mild blue cheese, heavy metal and bluegrass."
      </motion.p>
    </section>
  );
};

export default RecipesSection;
