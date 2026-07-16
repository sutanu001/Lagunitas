# 🍺 Lagunitas IPA — Full-Stack Product Page

A production-ready full-stack implementation of the Lagunitas IPA product landing page.

https://github.com/user-attachments/assets/998d51f0-e5e1-403f-b6bc-6418e625ae2b

## Architecture

```
┌─────────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│  React 18 + Vite    │───▶│  Node.js / Express   │───▶│    PostgreSQL 16    │
│  Framer Motion      │    │  API Gateway          │    │  Products, Views,   │
│  (Port 5173 dev)    │◀───│  (Port 5000)          │◀───│  Pairings           │
└─────────────────────┘    └──────────┬───────────┘    └─────────────────────┘
                                      │
                                      ▼
                           ┌──────────────────────┐
                           │  Python / FastAPI     │
                           │  ML Microservice      │
                           │  (Port 5001)          │
                           │                       │
                           │  • TF-IDF vectors     │
                           │  • Cosine similarity  │
                           │  • Food pairing score │
                           └──────────────────────┘
```

## Running Locally (Dev Mode)

### Option A — Individual services

```bash
# 1. Frontend
cd frontend && npm install && npm run dev    # → http://localhost:5173

# 2. Node.js API
cd backend-node && npm install && npm run dev  # → http://localhost:5000

# 3. Python ML service
cd backend-python
pip install -r requirements.txt
python main.py                               # → http://localhost:5001

# 4. (Optional) PostgreSQL via Docker
docker run -d -p 5432:5432 \
  -e POSTGRES_DB=lagunitas \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=lagunitas123 \
  -v $(pwd)/database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql \
  postgres:16-alpine
```

> **Note:** The frontend and Node.js API both fall back to in-memory data if the database or Python service is unavailable, so you can demo the full UI with just `npm run dev`.

### Option B — Docker Compose (all services)

```bash
docker-compose up --build
# → http://localhost (via Nginx)
# → http://localhost:5000/api  (Node.js API)
# → http://localhost:5001/docs (FastAPI Swagger)
```

## Project Structure

```
Lagunitas/
├── frontend/                  # React 18 + Vite + Framer Motion
│   └── src/
│       ├── api/client.js       # Axios API client
│       ├── hooks/useProduct.js # Data fetching with fallback
│       ├── components/         # All page sections + SVG components
│       │   ├── BeerBottle.jsx
│       │   ├── FlavorBlob.jsx
│       │   ├── HeroSection.jsx
│       │   ├── ProductInfoSection.jsx
│       │   ├── MouthfeelsSection.jsx
│       │   ├── FlavorNotesSection.jsx
│       │   ├── AvailabilitySection.jsx
│       │   ├── RecipesSection.jsx
│       │   ├── RecommendationsSection.jsx
│       │   └── SidebarNav.jsx
│       └── styles/sections.css
│
├── backend-node/              # Express API Gateway
│   └── src/
│       ├── server.js           # Entry point
│       ├── config/database.js  # PostgreSQL pool
│       ├── config/fallbackData.js
│       ├── controllers/productController.js
│       ├── routes/products.js
│       └── middleware/errorHandler.js
│
├── backend-python/            # FastAPI ML Microservice
│   ├── main.py                 # TF-IDF + cosine recommendations
│   └── requirements.txt
│
├── database/
│   └── schema.sql             # Full PostgreSQL schema + seed data
│
├── docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend-node
│   ├── Dockerfile.backend-python
│   └── nginx.conf
│
├── docker-compose.yml
└── .env                       # Root env defaults
```

## API Endpoints

### Node.js (Port 5000)
| Method | Path                           | Description                    |
|--------|--------------------------------|--------------------------------|
| GET    | `/api/health`                  | Health check                   |
| GET    | `/api/product`                 | List all products               |
| GET    | `/api/product/:slug`           | Get product details             |
| POST   | `/api/product/:slug/view`      | Record page view                |
| GET    | `/api/product/:slug/analytics` | View analytics                  |
| GET    | `/api/product/:slug/pairings`  | Food pairings (`?cuisine=X`)   |
| GET    | `/api/recommendations`         | Proxy → Python ML service      |
| GET    | `/api/analytics/popular`       | Popular beers analytics         |

### Python / FastAPI (Port 5001)
| Method | Path                               | Description                        |
|--------|------------------------------------|------------------------------------|
| GET    | `/docs`                            | Swagger UI                         |
| GET    | `/health`                          | Health check                       |
| GET    | `/recommendations?beer_id=1&top_n=3` | ML-powered recommendations       |
| GET    | `/recommendations/food-pairing`    | Food pairing scores                |
| GET    | `/analytics/popular`               | Popular beers                      |
| GET    | `/beers`                           | List all beers in ML store         |

## Design Features

- **Cream/off-white background** with grunge paper texture overlay
- **Bold red (`#C41E3A`) and black typography** in Playfair Display serif + Outfit sans
- **Parallax scroll effects** on hero bottle and MOUTHFEELS text
- **SVG beer bottle** with gradient glass, label, cap and highlight streaks
- **Organic flavor blobs** using SVG turbulence displacement filters
- **Sensory attribute bars** with animated fill
- **Fixed sidebar dot navigation** with section labels on hover
- **Scroll progress bar** at top of page
- **Graceful offline fallback** — works with zero backend services
