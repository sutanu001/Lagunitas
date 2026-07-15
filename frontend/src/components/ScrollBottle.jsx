import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * ScrollBottle — a smaller companion bottle that appears AFTER you scroll
 * past the hero and weaves along the left/right edges of the viewport.
 *
 * It does NOT replace the hero bottle — that stays untouched.
 * This bottle hugs the sides, staying out of the way of content.
 */
const ScrollBottle = () => {
  const { scrollYProgress } = useScroll();

  // ── Only visible after scrolling past the hero (>12%) and fades before footer ──
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.10, 0.16, 0.85, 0.93],
    [0, 0,    0.85, 0.85, 0],
  );

  // ── Horizontal: weave between left and right edges ──
  // Values are in vw-equivalent px (negative = left side, positive = right side)
  const x = useTransform(
    scrollYProgress,
    [0.12, 0.22, 0.35, 0.48, 0.60, 0.72, 0.85],
    [300,  -300, 320,  -280, 300,  -300, 260],
  );

  // ── Vertical bob so it doesn't feel static ──
  const y = useTransform(
    scrollYProgress,
    [0.12, 0.25, 0.40, 0.55, 0.70, 0.85],
    [0,    -30,  20,   -25,  15,   -20],
  );

  // ── Tilt with each direction change ──
  const rotate = useTransform(
    scrollYProgress,
    [0.12, 0.22, 0.35, 0.48, 0.60, 0.72, 0.85],
    [0,    8,    -10,  8,    -8,   10,   -5],
  );

  // ── Scale ──
  const scale = useTransform(
    scrollYProgress,
    [0.12, 0.20, 0.80, 0.90],
    [0.5,  0.65, 0.65, 0.4],
  );

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: '45%',
        left: '50%',
        translateX: '-50%',
        translateY: '-50%',
        x,
        y,
        rotate,
        scale,
        opacity,
        zIndex: 10,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 20px 40px rgba(26,18,8,0.22))',
        willChange: 'transform, opacity',
      }}
    >
      <img
        src="/bottle.png"
        alt=""
        aria-hidden="true"
        style={{
          height: 'clamp(200px, 28vh, 320px)',
          width: 'auto',
          objectFit: 'contain',
          mixBlendMode: 'multiply',
        }}
      />
    </motion.div>
  );
};

export default ScrollBottle;
