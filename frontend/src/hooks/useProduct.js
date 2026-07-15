import { useState, useEffect } from 'react';
import { productApi } from '../api/client';

// Static fallback for when the API is unavailable
const FALLBACK_PRODUCT = {
  id: 1,
  slug: 'ipa',
  name: 'India Pale Ale',
  tagline: 'Unlimited Release',
  description:
    "Lagunitas IPA was our first seasonal way back in 1995. The recipe was formulated with malt and hops working together to balance it all out on your buds so you can knock back more than one without wearing yourself out. Big on the aroma with a hoppy-sweet finish that'll leave you wantin' another sip.",
  style_desc:
    "In the world of India Pale Ales, our darling is a bit of a rare gem. We proudly brew Lagunitas IPA year round as a friendly, well-balanced beer that's great for IPA beginners and lifelong IPA fans alike.",
  mouthfeel:
    "A well-rounded, highly drinkable IPA packed with 'C-word' hops and rounded out with some simcoe. The taste is a clean mix of refreshing citrus, sweet caramel and pleasant bitterness. Pairs with mild blue cheese, heavy metal and bluegrass.",
  abv: 6.2,
  ibu: 51.1,
  og: 1.059,
  flavors: [
    {
      name: 'Orange – C Hops',
      description: 'The use of old-school C-hops brings a touch of citrus flavor that is both bright and deep.',
      color: 'red',
      icon: 'hop',
    },
    {
      name: 'Pine',
      description: 'The pine, from hops, brings balance to the citrus and caramel flavors that dominate the beer.',
      color: 'red',
      icon: 'pine',
    },
    {
      name: 'Caramel – Malt',
      description: 'The use of English caramel malt brings a depth of flavor and a hint of sweetness to the beer.',
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
};

/**
 * useProduct — fetches product data by slug, falls back gracefully.
 */
export const useProduct = (slug = 'ipa') => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    productApi
      .getBySlug(slug)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch(() => {
        if (!cancelled) {
          setProduct(FALLBACK_PRODUCT);
          setError('API unavailable — showing local data.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Fire a non-blocking view ping
    productApi.recordView(slug).catch(() => {});

    return () => { cancelled = true; };
  }, [slug]);

  return { product, loading, error };
};
