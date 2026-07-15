// ============================================================
// In-memory product data — used when PostgreSQL is unavailable
// ============================================================

export const PRODUCTS_FALLBACK = {
  ipa: {
    id: 1,
    slug: 'ipa',
    name: 'India Pale Ale',
    tagline: 'Unlimited Release',
    description:
      "Lagunitas IPA was our first seasonal way back in 1995. The recipe was formulated with malt and hops working together to balance it all out on your buds so you can knock back more than one without wearing yourself out. Big on the aroma with a hoppy-sweet finish that'll leave you wantin' another sip. Made with 43 different hops and 65 various malts, this resident air will likely float your boat, whatever planet you're on.",
    style_desc:
      "In the world of India Pale Ales, our darling is a bit of a rare gem. We've been called easy (to drink), we've been called highly drinkable. But don't let the names others call us bias your perception, man. We proudly brew Lagunitas IPA year round as a friendly, well-balanced beer that's great for IPA beginners and lifelong IPA fans alike.",
    mouthfeel:
      "A well-rounded, highly drinkable IPA packed with 'C-word' hops and rounded out with some simcoe. The taste is a clean mix of refreshing citrus, sweet caramel and pleasant bitterness. Lagunitas IPA has a light orange body, a long lasting head, a full bodied aroma, and a nice sharp hop finish. Pairs with mild blue cheese, heavy metal and bluegrass.",
    abv: 6.2,
    ibu: 51.1,
    og: 1.059,
    flavors: [
      {
        name: 'Orange – C Hops',
        description:
          'The use of old-school C-hops brings a touch of citrus flavor that is both bright and deep.',
        color: 'red',
        icon: 'hop',
      },
      {
        name: 'Pine',
        description:
          'The pine, from hops, brings balance to the citrus and caramel flavors that dominate the beer.',
        color: 'red',
        icon: 'pine',
      },
      {
        name: 'Caramel – Malt',
        description:
          'The use of English caramel malt brings a depth of flavor and a hint of sweetness to the beer.',
        color: 'black',
        icon: 'malt',
      },
    ],
    availability: [
      { type: 'On Tap',      label: 'DRAFT' },
      { type: '22oz Bottle', label: 'SINGLE' },
      { type: '12oz Bottle', label: '6- OR 12-PACK' },
      { type: '12oz Can',    label: '6- OR 12-PACK' },
      { type: '19.2oz Can',  label: 'SINGLE' },
    ],
    food_pairings: ['Spicy Fish Tacos', 'Blue Cheese Burger', 'Tonkotsu Ramen', 'Margherita Pizza', 'Grilled Salmon'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  'little-sumpin': {
    id: 2,
    slug: 'little-sumpin',
    name: "Little Sumpin' Sumpin'",
    tagline: 'Pale Wheat Ale',
    description:
      "A truly unique style of Pale Wheat Ale, this cloudy beauty is light on the palate with a strong hop finish that'll knock your socks off.",
    style_desc:
      'Easy-drinking wheat ale with a remarkable hop presence. A real crowd-pleaser that blurs the line between wheat beer and IPA.',
    mouthfeel:
      'Smooth wheat body with a surprising hop kick. Light and refreshing up front, bold and resinous at the finish.',
    abv: 7.5,
    ibu: 64.2,
    og: 1.063,
    flavors: [
      { name: 'Wheat',  description: 'Soft wheat malt gives the body a smooth, pillowy texture.', color: 'red',   icon: 'wheat' },
      { name: 'Citrus', description: 'Bright lemon and orange notes from the dry-hop addition.',   color: 'red',   icon: 'citrus' },
      { name: 'Floral', description: 'Delicate floral aromatics round out the hop bill.',           color: 'black', icon: 'floral' },
    ],
    availability: [
      { type: 'On Tap',      label: 'DRAFT' },
      { type: '12oz Bottle', label: '6-PACK' },
      { type: '12oz Can',    label: '6-PACK' },
    ],
    food_pairings: ['Sushi Platter', 'Caesar Salad', 'Grilled Chicken', 'Goat Cheese Pizza'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
};
