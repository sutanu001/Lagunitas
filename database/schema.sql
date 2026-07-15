-- ==========================================================
-- Lagunitas Product Database Schema
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================
-- TABLES
-- ==========================================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id           SERIAL PRIMARY KEY,
    slug         VARCHAR(50)  UNIQUE NOT NULL,
    name         VARCHAR(100) NOT NULL,
    tagline      VARCHAR(100),
    description  TEXT,
    style_desc   TEXT,
    mouthfeel    TEXT,
    abv          DECIMAL(4,2),
    ibu          DECIMAL(5,2),
    og           DECIMAL(5,3),
    flavors      JSONB        DEFAULT '[]'::jsonb,
    availability JSONB        DEFAULT '[]'::jsonb,
    image_url    VARCHAR(255),
    is_active    BOOLEAN      DEFAULT true,
    created_at   TIMESTAMPTZ  DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- Product views analytics
CREATE TABLE IF NOT EXISTS product_views (
    id           SERIAL PRIMARY KEY,
    product_slug VARCHAR(50)  REFERENCES products(slug) ON DELETE CASCADE,
    viewed_at    TIMESTAMPTZ  DEFAULT NOW(),
    ip_address   INET,
    user_agent   TEXT,
    session_id   UUID
);

-- User preferences (for ML recommendations)
CREATE TABLE IF NOT EXISTS user_preferences (
    id                  SERIAL PRIMARY KEY,
    user_id             UUID         DEFAULT uuid_generate_v4() UNIQUE,
    preferred_styles    TEXT[]       DEFAULT '{}',
    preferred_abv_min   DECIMAL(4,2) DEFAULT 0,
    preferred_abv_max   DECIMAL(4,2) DEFAULT 15,
    flavor_preferences  TEXT[]       DEFAULT '{}',
    created_at          TIMESTAMPTZ  DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  DEFAULT NOW()
);

-- Food pairings
CREATE TABLE IF NOT EXISTS food_pairings (
    id            SERIAL PRIMARY KEY,
    product_slug  VARCHAR(50)   REFERENCES products(slug) ON DELETE CASCADE,
    dish_name     VARCHAR(100),
    cuisine_type  VARCHAR(50),
    pairing_notes TEXT,
    match_score   DECIMAL(3,2)  CHECK (match_score BETWEEN 0 AND 1),
    created_at    TIMESTAMPTZ   DEFAULT NOW()
);

-- Beer recommendations (pre-computed)
CREATE TABLE IF NOT EXISTS beer_recommendations (
    id              SERIAL PRIMARY KEY,
    source_slug     VARCHAR(50) REFERENCES products(slug) ON DELETE CASCADE,
    target_slug     VARCHAR(50) REFERENCES products(slug) ON DELETE CASCADE,
    similarity_score DECIMAL(5,4),
    method          VARCHAR(50) DEFAULT 'tfidf_cosine',
    computed_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_slug, target_slug)
);

-- ==========================================================
-- INDEXES
-- ==========================================================

CREATE INDEX IF NOT EXISTS idx_products_slug      ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active    ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_views_slug         ON product_views(product_slug);
CREATE INDEX IF NOT EXISTS idx_views_date         ON product_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_views_ip           ON product_views(ip_address);
CREATE INDEX IF NOT EXISTS idx_pairings_slug      ON food_pairings(product_slug);
CREATE INDEX IF NOT EXISTS idx_pairings_cuisine   ON food_pairings(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_recs_source        ON beer_recommendations(source_slug);

-- ==========================================================
-- FUNCTIONS & TRIGGERS
-- ==========================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_prefs_updated_at ON user_preferences;
CREATE TRIGGER update_user_prefs_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================================
-- VIEWS
-- ==========================================================

CREATE OR REPLACE VIEW product_analytics AS
SELECT
    p.slug,
    p.name,
    p.abv,
    p.ibu,
    COUNT(pv.id)              AS total_views,
    COUNT(DISTINCT pv.ip_address) AS unique_visitors,
    MAX(pv.viewed_at)         AS last_viewed,
    DATE_TRUNC('day', NOW()) - DATE_TRUNC('day', MAX(pv.viewed_at)) AS days_since_last_view
FROM products p
LEFT JOIN product_views pv ON p.slug = pv.product_slug
WHERE p.is_active = true
GROUP BY p.slug, p.name, p.abv, p.ibu;

-- ==========================================================
-- SEED DATA
-- ==========================================================

INSERT INTO products (slug, name, tagline, description, style_desc, mouthfeel, abv, ibu, og, flavors, availability)
VALUES (
    'ipa',
    'India Pale Ale',
    'Unlimited Release',
    'Lagunitas IPA was our first seasonal way back in 1995. The recipe was formulated with malt and hops working together to balance it all out on your buds so you can knock back more than one without wearing yourself out. Big on the aroma with a hoppy-sweet finish that''ll leave you wantin'' another sip. Made with 43 different hops and 65 various malts, this resident air will likely float your boat, whatever planet you''re on.',
    'In the world of India Pale Ales, our darling is a bit of a rare gem. We''ve been called easy (to drink), we''ve been called highly drinkable. But don''t let the names others call us bias your perception, man. We proudly brew Lagunitas IPA year round as a friendly, well-balanced beer that''s great for IPA beginners and lifelong IPA fans alike.',
    'A well-rounded, highly drinkable IPA packed with ''C-word'' hops and rounded out with some simcoe. The taste is a clean mix of refreshing citrus, sweet caramel and pleasant bitterness. Lagunitas IPA has a light orange body, a long lasting head, a full bodied aroma, and a nice sharp hop finish. Pairs with mild blue cheese, heavy metal and bluegrass.',
    6.2, 51.1, 1.059,
    '[
        {"name": "Orange \u2013 C Hops", "description": "The use of old-school C-hops brings a touch of citrus flavor that is both bright and deep.", "color": "red", "icon": "hop"},
        {"name": "Pine", "description": "The pine, from hops, brings balance to the citrus and caramel flavors that dominate the beer.", "color": "red", "icon": "pine"},
        {"name": "Caramel \u2013 Malt", "description": "The use of English caramel malt brings a depth of flavor and a hint of sweetness to the beer.", "color": "black", "icon": "malt"}
    ]'::jsonb,
    '[
        {"type": "On Tap",      "label": "DRAFT"},
        {"type": "22oz Bottle", "label": "SINGLE"},
        {"type": "12oz Bottle", "label": "6- OR 12-PACK"},
        {"type": "12oz Can",    "label": "6- OR 12-PACK"},
        {"type": "19.2oz Can",  "label": "SINGLE"}
    ]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (slug, name, tagline, description, style_desc, mouthfeel, abv, ibu, og, flavors, availability)
VALUES (
    'little-sumpin',
    'Little Sumpin'' Sumpin''',
    'Pale Wheat Ale',
    'A truly unique style of Pale Wheat Ale, this cloudy beauty is light on the palate with a strong hop finish.',
    'Easy-drinking wheat ale with a remarkable hop presence. A real crowd-pleaser.',
    'Smooth wheat body with a surprising hop kick. Light and refreshing up front, bold and resinous at the finish.',
    7.5, 64.2, 1.063,
    '[
        {"name": "Wheat", "description": "Soft wheat malt gives the body a smooth, pillowy texture.", "color": "red", "icon": "wheat"},
        {"name": "Citrus", "description": "Bright lemon and orange notes from the dry-hop addition.", "color": "red", "icon": "citrus"},
        {"name": "Floral", "description": "Delicate floral aromatics round out the hop bill.", "color": "black", "icon": "floral"}
    ]'::jsonb,
    '[
        {"type": "On Tap",      "label": "DRAFT"},
        {"type": "12oz Bottle", "label": "6-PACK"},
        {"type": "12oz Can",    "label": "6-PACK"}
    ]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- Food pairing seed data
INSERT INTO food_pairings (product_slug, dish_name, cuisine_type, pairing_notes, match_score)
VALUES
    ('ipa', 'Spicy Fish Tacos',        'Mexican',   'The citrus hops cut through the heat beautifully.',            0.95),
    ('ipa', 'Blue Cheese Burger',      'American',  'Classic pairing — bold bitterness meets bold cheese.',          0.92),
    ('ipa', 'Tonkotsu Ramen',          'Japanese',  'Hoppy bitterness balances the rich pork broth.',               0.88),
    ('ipa', 'Margherita Pizza',        'Italian',   'Crisp bitterness refreshes the palate between bites.',         0.85),
    ('ipa', 'Grilled Salmon',          'American',  'Pine notes echo the char on the fish.',                        0.82),
    ('ipa', 'Sharp Cheddar Board',     'American',  'Caramel malt notes play against aged cheddar.',                0.80),
    ('little-sumpin', 'Sushi Platter', 'Japanese',  'Light wheat body won''t overpower delicate flavors.',          0.93),
    ('little-sumpin', 'Caesar Salad',  'American',  'Floral hops complement the anchovy-lemon dressing.',          0.85);
