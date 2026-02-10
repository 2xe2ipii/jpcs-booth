from fastapi import FastAPI
from app.core.database import engine, Base
from app.routers import players, matches

# Create Tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(title="JPCS Booth API")

# Include Routers
app.include_router(players.router)
app.include_router(matches.router)

@app.get("/")
def root():
    return {"message": "JPCS Game Booth API is running!"}