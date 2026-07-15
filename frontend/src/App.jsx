import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import './index.css';
import './styles/sections.css';

import { useProduct }            from './hooks/useProduct';
import SidebarNav                from './components/SidebarNav';
import HeroSection               from './components/HeroSection';
import ProductInfoSection        from './components/ProductInfoSection';
import MouthfeelsSection         from './components/MouthfeelsSection';
import FlavorNotesSection        from './components/FlavorNotesSection';
import AvailabilitySection       from './components/AvailabilitySection';
import RecipesSection            from './components/RecipesSection';
import RecommendationsSection    from './components/RecommendationsSection';
import ScrollBottle              from './components/ScrollBottle';

// ── Scroll Progress Bar ────────────────────────────────────────────────────────
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      className="progress-bar"
      style={{ scaleX, transformOrigin: 'left' }}
    />
  );
};

// ── Section IDs for intersection observer ────────────────────────────────────
const SECTION_IDS = [
  'hero', 'product-info', 'mouthfeels', 'flavor-notes',
  'availability', 'recipes', 'recommendations',
];

// ── App ────────────────────────────────────────────────────────────────────────
function App() {
  const { product, loading, error } = useProduct('ipa');
  const [activeSection, setActiveSection] = useState('hero');

  // Intersection Observer for sidebar nav
  useEffect(() => {
    const observers = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.35 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [loading]); // re-run after content is loaded

  // ── Loading screen ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight: '100svh',
        background: 'var(--cream)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
      }}>
        <motion.div
          style={{
            width: 60, height: 60,
            border: '3px solid var(--cream-dark)',
            borderTopColor: 'var(--red)',
            borderRadius: '50%',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
        <p className="label text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <>
      <ScrollProgress />
      <ScrollBottle />
      <SidebarNav activeSection={activeSection} />


      <main>
        <HeroSection            product={product} />
        <ProductInfoSection     product={product} />
        <MouthfeelsSection      product={product} />
        <FlavorNotesSection     product={product} />
        <AvailabilitySection    product={product} />
        <RecipesSection />
        <RecommendationsSection productId={product?.id ?? 1} />
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer__logo">
          Lagunitas <span>IPA</span>
        </div>
        <p className="footer__tagline">Unlimited Release · Petaluma, California</p>

        <nav className="footer__links" aria-label="Footer navigation">
          {['Our Beers', 'Find Near You', 'Taproom', 'Blog', 'Merch'].map((link) => (
            <a key={link} href="#" onClick={(e) => e.preventDefault()}>{link}</a>
          ))}
        </nav>

        <p className="footer__copy">
          © {new Date().getFullYear()} Lagunitas Brewing Company · Petaluma, CA ·
          Please enjoy responsibly. Must be 21+ to consume.
        </p>
      </footer>
    </>
  );
}

export default App;
