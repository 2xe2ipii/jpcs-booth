from pydantic import BaseModel
from typing import Optional, List

# --- PLAYER SCHEMAS ---
class PlayerBase(BaseModel):
    name: str

class PlayerCreate(PlayerBase):
    # Optional: If they pick an existing user, they send the ID.
    # If they want a new one, they send null/empty, and we generate it.
    student_id: Optional[str] = None 

class PlayerResponse(PlayerBase):
    id: int
    student_id: str # This is the "John#1234"
    total_points: int
    
    class Config:
        from_attributes = True

# --- MATCH SCHEMAS ---
class MatchCreate(BaseModel):
    player1_student_id: str
    player2_student_id: str

class MatchResponse(BaseModel):
    id: int
    status: str
    player1: PlayerResponse
    player2: PlayerResponse

    class Config:
        from_attributes = True

# --- SCORE SUBMISSION ---
class ScoreSubmit(BaseModel):
    score1: int
    score2: int