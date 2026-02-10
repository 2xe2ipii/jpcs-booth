from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas import all_schemas
from app.crud import services

router = APIRouter(prefix="/players", tags=["Players"])

@router.get("/search", response_model=List[all_schemas.PlayerResponse])
def search_players(name: str, db: Session = Depends(get_db)):
    """Finds all players named 'John' so user can pick 'John#1234'"""
    return services.get_players_by_name(db, name)

@router.post("/register", response_model=all_schemas.PlayerResponse)
def register(player: all_schemas.PlayerCreate, db: Session = Depends(get_db)):
    return services.create_player(db, player)

@router.get("/leaderboard", response_model=List[all_schemas.PlayerResponse])
def get_leaderboard(db: Session = Depends(get_db)):
    return services.get_leaderboard(db)