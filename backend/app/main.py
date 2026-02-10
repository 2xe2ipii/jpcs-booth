from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <--- IMPORT THIS
from app.core.database import engine, Base
from app.routers import players, matches

# Create Tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(title="JPCS Booth API")

# --- ADD THIS BLOCK ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (PC, Phone, Tablet)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)
# ----------------------

# Include Routers
app.include_router(players.router)
app.include_router(matches.router)

@app.get("/")
def root():
    return {"message": "JPCS Game Booth API is running!"}