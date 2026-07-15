"""
Lagunitas Python/FastAPI ML Microservice
Responsibilities:
  - Beer recommendation via TF-IDF + cosine similarity
  - Food pairing scoring
  - Analytics aggregation
"""

from __future__ import annotations

import os
from typing import List, Optional

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler

load_dotenv()

# ──────────────────────────────────────────────────────────────────────────────
# App init
# ──────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Lagunitas ML Microservice",
    description="Beer recommendation engine, food pairing scorer, and analytics aggregator.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────────────────────────────────────
# Data store
# ──────────────────────────────────────────────────────────────────────────────

BEERS: list[dict] = [
    {
        "id": 1,
        "slug": "ipa",
        "name": "IPA",
        "style": "India Pale Ale",
        "abv": 6.2,
        "ibu": 51.1,
        "og": 1.059,
        "description": "A well-rounded, highly drinkable IPA with citrus, caramel and pleasant bitterness.",
        "flavor_profile": "citrus pine caramel hoppy balanced orange resinous",
        "food_pairings": ["spicy fish tacos", "blue cheese burger", "tonkotsu ramen", "margherita pizza", "grilled salmon"],
        "season": "year_round",
        "tags": ["ipa", "hoppy", "citrus", "balanced", "session-friendly"],
    },
    {
        "id": 2,
        "slug": "little-sumpin",
        "name": "Little Sumpin' Sumpin'",
        "style": "Pale Wheat Ale",
        "abv": 7.5,
        "ibu": 64.2,
        "og": 1.063,
        "description": "A truly unique style featuring a strong hop finish on a silky wheat body.",
        "flavor_profile": "wheat hoppy smooth citrus floral silky",
        "food_pairings": ["sushi", "caesar salad", "grilled chicken", "goat cheese pizza"],
        "season": "year_round",
        "tags": ["wheat", "hoppy", "citrus", "floral", "smooth"],
    },
    {
        "id": 3,
        "slug": "maximus",
        "name": "Maximus",
        "style": "Double IPA",
        "abv": 8.2,
        "ibu": 72.5,
        "og": 1.072,
        "description": "Big beer with a big hop profile. Not for the faint of heart.",
        "flavor_profile": "intense hoppy bitter tropical resinous pine grapefruit",
        "food_pairings": ["ribeye steak", "bbq ribs", "sharp cheddar", "dark chocolate"],
        "season": "year_round",
        "tags": ["dipa", "intense", "hoppy", "tropical", "resinous"],
    },
    {
        "id": 4,
        "slug": "sucks",
        "name": "Sucks",
        "style": "Brown Shugga' Substitute Ale",
        "abv": 8.0,
        "ibu": 63.0,
        "og": 1.071,
        "description": "Caramel malt with a sticky hop sweetness that lingers.",
        "flavor_profile": "caramel sweet hoppy malty complex toffee",
        "food_pairings": ["pulled pork", "roasted root vegetables", "gouda", "pecan pie"],
        "season": "seasonal",
        "tags": ["malty", "caramel", "sweet", "complex", "seasonal"],
    },
    {
        "id": 5,
        "slug": "daytime",
        "name": "DayTime",
        "style": "Fractional IPA",
        "abv": 4.0,
        "ibu": 31.0,
        "og": 1.036,
        "description": "Light and refreshing with all the hop flavor, almost none of the alcohol.",
        "flavor_profile": "light crisp hoppy session citrus refreshing",
        "food_pairings": ["caesar salad", "grilled seafood", "light pasta", "goat cheese"],
        "season": "year_round",
        "tags": ["session", "light", "hoppy", "refreshing", "low-abv"],
    },
]

# Build a DataFrame for efficient vectorised operations
_df = pd.DataFrame(BEERS)

# ──────────────────────────────────────────────────────────────────────────────
# ML: Pre-compute TF-IDF matrix once at startup
# ──────────────────────────────────────────────────────────────────────────────

_vectorizer   = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
_tfidf_matrix = _vectorizer.fit_transform(_df["flavor_profile"].tolist())

# Numeric features: ABV, IBU normalised to [0, 1]
_scaler         = MinMaxScaler()
_numeric_feats  = _scaler.fit_transform(_df[["abv", "ibu"]].values)

# Combined similarity: 70% text, 30% numeric
_TEXT_WEIGHT    = 0.70
_NUMERIC_WEIGHT = 0.30


def _combined_similarity(target_idx: int) -> np.ndarray:
    text_sim    = cosine_similarity(_tfidf_matrix[target_idx:target_idx + 1], _tfidf_matrix)[0]
    numeric_sim = 1.0 - np.linalg.norm(
        _numeric_feats - _numeric_feats[target_idx], axis=1
    ) / (np.sqrt(2) or 1)  # normalised euclidean → similarity
    return _TEXT_WEIGHT * text_sim + _NUMERIC_WEIGHT * numeric_sim


# ──────────────────────────────────────────────────────────────────────────────
# Pydantic models
# ──────────────────────────────────────────────────────────────────────────────

class BeerSummary(BaseModel):
    id:            int
    slug:          str
    name:          str
    style:         str
    abv:           float
    ibu:           float
    flavor_profile: str

class Recommendation(BaseModel):
    beer:             BeerSummary
    similarity_score: float = Field(..., ge=0, le=1)
    reasoning:        str

class RecommendationResponse(BaseModel):
    target_beer:     BeerSummary
    recommendations: List[Recommendation]
    method:          str

class FoodPairingItem(BaseModel):
    food:         str
    match_score:  float
    reasoning:    str

class FoodPairingResponse(BaseModel):
    beer:         BeerSummary
    pairings:     List[FoodPairingItem]
    cuisine_filter: Optional[str] = None

# ──────────────────────────────────────────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────────────────────────────────────────

@app.get("/", summary="Root")
async def root():
    return {"message": "Lagunitas ML Service", "status": "running", "version": "1.0.0"}


@app.get("/health", summary="Health check")
async def health_check():
    return {"status": "healthy", "service": "python-ml", "beers_loaded": len(BEERS)}


@app.get(
    "/recommendations",
    response_model=RecommendationResponse,
    summary="Beer recommendations via TF-IDF + numeric similarity",
)
async def get_recommendations(
    beer_id: int = Query(..., description="ID of the beer to base recommendations on"),
    top_n:   int = Query(3, ge=1, le=5, description="Number of recommendations to return"),
):
    target_row = _df[_df["id"] == beer_id]
    if target_row.empty:
        raise HTTPException(status_code=404, detail=f"Beer with id={beer_id} not found.")

    target_idx = int(target_row.index[0])
    sims       = _combined_similarity(target_idx)

    # Exclude the target itself and pick top-n
    sorted_idx = sims.argsort()[::-1]
    recs_idx   = [i for i in sorted_idx if i != target_idx][:top_n]

    def _make_summary(row: pd.Series) -> BeerSummary:
        return BeerSummary(
            id=int(row["id"]),
            slug=row["slug"],
            name=row["name"],
            style=row["style"],
            abv=float(row["abv"]),
            ibu=float(row["ibu"]),
            flavor_profile=row["flavor_profile"],
        )

    target_beer = _make_summary(_df.iloc[target_idx])

    recommendations = []
    for i in recs_idx:
        rec_row   = _df.iloc[i]
        rec_score = float(sims[i])

        # Build a human-readable reasoning string
        target_words = set(target_beer.flavor_profile.split())
        rec_words    = set(rec_row["flavor_profile"].split())
        shared       = target_words & rec_words
        reasoning    = (
            f"Shares {len(shared)} flavor {'note' if len(shared) == 1 else 'notes'}"
            f" ({', '.join(sorted(shared)[:3])})" if shared else "Similar overall profile"
        )

        recommendations.append(
            Recommendation(
                beer=_make_summary(rec_row),
                similarity_score=round(rec_score, 4),
                reasoning=reasoning,
            )
        )

    return RecommendationResponse(
        target_beer=target_beer,
        recommendations=recommendations,
        method="tfidf_cosine + numeric_euclidean (70/30 blend)",
    )


@app.get(
    "/recommendations/food-pairing",
    response_model=FoodPairingResponse,
    summary="Food pairing suggestions for a beer",
)
async def get_food_pairings(
    beer_id:      int           = Query(..., description="Beer ID"),
    cuisine_type: Optional[str] = Query(None, description="Optional cuisine filter (e.g. Mexican)"),
):
    target_row = _df[_df["id"] == beer_id]
    if target_row.empty:
        raise HTTPException(status_code=404, detail=f"Beer with id={beer_id} not found.")

    row      = target_row.iloc[0]
    pairings = row["food_pairings"]
    fp_words = row["flavor_profile"].split()
    primary  = fp_words[0] if fp_words else "hoppy"

    # Score each pairing
    scored: list[FoodPairingItem] = []
    for dish in pairings:
        if cuisine_type and cuisine_type.lower() not in dish.lower():
            score = 0.55  # still included but lower scored
        else:
            score = round(np.random.uniform(0.80, 0.98), 2)  # deterministic in prod would use a real model

        scored.append(
            FoodPairingItem(
                food=dish,
                match_score=score,
                reasoning=f"Complements the {primary} character of {row['name']}.",
            )
        )

    scored.sort(key=lambda x: x.match_score, reverse=True)

    def _row_to_summary(r: pd.Series) -> BeerSummary:
        return BeerSummary(
            id=int(r["id"]), slug=r["slug"], name=r["name"],
            style=r["style"], abv=float(r["abv"]), ibu=float(r["ibu"]),
            flavor_profile=r["flavor_profile"],
        )

    return FoodPairingResponse(
        beer=_row_to_summary(row),
        pairings=scored,
        cuisine_filter=cuisine_type,
    )


@app.get("/analytics/popular", summary="Popular beers analytics")
async def get_popular_beers():
    """
    In production this would query PostgreSQL via asyncpg.
    Returns simulated analytics for the demo.
    """
    return {
        "most_viewed": [
            {"beer_id": 1, "slug": "ipa",           "name": "IPA",                     "views": 15_420},
            {"beer_id": 2, "slug": "little-sumpin",  "name": "Little Sumpin' Sumpin'", "views":  8_930},
            {"beer_id": 3, "slug": "maximus",         "name": "Maximus",                "views":  6_210},
            {"beer_id": 5, "slug": "daytime",         "name": "DayTime",               "views":  4_780},
            {"beer_id": 4, "slug": "sucks",           "name": "Sucks",                 "views":  3_540},
        ],
        "trending_flavors":    ["citrus", "hoppy", "caramel", "tropical"],
        "seasonal_preference": "year_round",
        "avg_abv_preference":  6.4,
        "avg_ibu_preference":  55.2,
    }


@app.get("/beers", summary="List all beers in ML store")
async def list_beers():
    return [
        {"id": b["id"], "slug": b["slug"], "name": b["name"], "style": b["style"],
         "abv": b["abv"], "ibu": b["ibu"]}
        for b in BEERS
    ]


# ──────────────────────────────────────────────────────────────────────────────
# Dev runner
# ──────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "5001")),
        reload=True,
        log_level="info",
    )
