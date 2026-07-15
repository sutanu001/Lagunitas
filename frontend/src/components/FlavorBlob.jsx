/**
 * FlavorBlob — organic SVG splash/ink-blot for flavor notes.
 * colorVariant: 'red' | 'black'
 * icon: 'hop' | 'pine' | 'malt' | 'citrus' | 'wheat' | 'floral'
 */
const FlavorBlob = ({ colorVariant = 'red', icon = 'hop', size = 200 }) => {
  const fill   = colorVariant === 'red'   ? '#C41E3A' : '#1a1208';
  const fillLt = colorVariant === 'red'   ? '#e03352' : '#2c2015';

  // Unique turbulence per icon keeps each blob looking distinct
  const seedMap = { hop: 42, pine: 17, malt: 88, citrus: 33, wheat: 61, floral: 95 };
  const seed = seedMap[icon] || 42;

  const IconPath = () => {
    switch (icon) {
      case 'hop':
        return (
          <g transform="translate(100,100)" fill="white" opacity="0.85">
            <ellipse cx="0" cy="-22" rx="10" ry="15" transform="rotate(-20)" />
            <ellipse cx="16" cy="8"  rx="10" ry="15" transform="rotate(60)" />
            <ellipse cx="-16" cy="8" rx="10" ry="15" transform="rotate(-60)" />
            <circle cx="0" cy="0" r="5" />
          </g>
        );
      case 'pine':
        return (
          <g transform="translate(100,115)" fill="white" opacity="0.85">
            <polygon points="0,-38 14,0 -14,0" />
            <polygon points="0,-20 18,18 -18,18" />
            <rect x="-5" y="18" width="10" height="10" />
          </g>
        );
      case 'malt':
        return (
          <g transform="translate(100,105)" fill="white" opacity="0.85">
            <rect x="-22" y="-8"  width="44" height="12" rx="6" />
            <rect x="-16" y="-22" width="32" height="10" rx="5" />
            <rect x="-10" y="8"   width="20" height="8"  rx="4" />
            {[...Array(5)].map((_, i) => (
              <rect key={i} x={-18 + i * 9} y="-38" width="6" height="14" rx="3" />
            ))}
          </g>
        );
      case 'citrus':
        return (
          <g transform="translate(100,100)" fill="white" opacity="0.85">
            <circle cx="0" cy="0" r="22" fill="none" stroke="white" strokeWidth="5" opacity="0.85" />
            <line x1="0" y1="-22" x2="0" y2="22" stroke="white" strokeWidth="3" />
            <line x1="-22" y1="0" x2="22" y2="0" stroke="white" strokeWidth="3" />
            <line x1="-16" y1="-16" x2="16" y2="16" stroke="white" strokeWidth="2" />
            <line x1="16" y1="-16" x2="-16" y2="16" stroke="white" strokeWidth="2" />
          </g>
        );
      case 'wheat':
        return (
          <g transform="translate(100,110)" fill="white" opacity="0.85">
            <line x1="0" y1="30" x2="0" y2="-35" stroke="white" strokeWidth="3" strokeLinecap="round" />
            {[[-8,-25],[8,-20],[-9,-10],[9,-5],[-8,8],[8,13]].map(([x,y],i) => (
              <ellipse key={i} cx={x} cy={y} rx="9" ry="5" transform={`rotate(${x > 0 ? 20 : -20},${x},${y})`} />
            ))}
          </g>
        );
      case 'floral':
        return (
          <g transform="translate(100,100)" fill="white" opacity="0.85">
            {[0,60,120,180,240,300].map(a => (
              <ellipse key={a} cx="0" cy="-20" rx="8" ry="14"
                transform={`rotate(${a})`} />
            ))}
            <circle cx="0" cy="0" r="7" fill="white" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id={`blob-${icon}-${colorVariant}`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015"
            numOctaves="4"
            seed={seed}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="28"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feComposite in="displaced" in2="SourceGraphic" operator="in" />
        </filter>
        <radialGradient id={`blobGrad-${icon}`} cx="40%" cy="35%">
          <stop offset="0%"   stopColor={fillLt} />
          <stop offset="100%" stopColor={fill} />
        </radialGradient>
      </defs>

      {/* Blob shape */}
      <ellipse
        cx="100" cy="100"
        rx="82" ry="78"
        fill={`url(#blobGrad-${icon})`}
        filter={`url(#blob-${icon}-${colorVariant})`}
      />

      {/* Icon */}
      <IconPath />
    </svg>
  );
};

export default FlavorBlob;
