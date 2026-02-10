from pydantic import BaseModel
from typing import Optional, List

# --- PLAYER SCHEMAS ---
class PlayerBase(BaseModel):
    student_id: str
    name: str

class PlayerCreate(PlayerBase):
    pass

class PlayerResponse(PlayerBase):
    id: int
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

# --- SCORE SUBMISSION (FROM ARDUINO) ---
class ScoreSubmit(BaseModel):
    score1: int
    score2: int