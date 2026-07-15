import { motion } from 'framer-motion';
import FlavorBlob from './FlavorBlob';

const FlavorNotesSection = ({ product }) => {
  const flavors = product?.flavors || [];

  return (
    <section id="flavor-notes" className="flavors">
      {/* Header */}
      <motion.div
        className="flavors__header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="flavors__title">Flavor Notes</p>
        <h2
          className="display-md"
          style={{ color: 'var(--black)', textTransform: 'uppercase', letterSpacing: '-0.02em' }}
        >
          What you'll taste
        </h2>
      </motion.div>

      {/* Grid */}
      <div className="flavors__grid">
        {flavors.map((flavor, i) => (
          <motion.div
            key={flavor.name}
            className="flavor-card"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            {/* Blob graphic */}
            <div className="flavor-card__blob">
              <motion.div
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
              >
                <FlavorBlob
                  colorVariant={flavor.color || 'red'}
                  icon={flavor.icon || 'hop'}
                  size={200}
                />
              </motion.div>
            </div>

            <h3 className={`flavor-card__name ${flavor.color === 'black' ? 'black' : 'red'}`}>
              {flavor.name}
            </h3>

            <p className="flavor-card__desc">{flavor.description}</p>
          </motion.div>
        ))}

        {/* Fallback if no flavors */}
        {flavors.length === 0 && ['Orange – C Hops', 'Pine', 'Caramel – Malt'].map((name, i) => (
          <div key={name} className="flavor-card">
            <div className="flavor-card__blob">
              <FlavorBlob colorVariant={i < 2 ? 'red' : 'black'} icon={['hop','pine','malt'][i]} size={200} />
            </div>
            <h3 className={`flavor-card__name ${i < 2 ? 'red' : 'black'}`}>{name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlavorNotesSection;
