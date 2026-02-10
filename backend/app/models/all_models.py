from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, unique=True, index=True) # e.g., "2023-1011"
    name = Column(String)
    
    # Logic: total_points handles the +/- 5 rule (Leaderboard)
    total_points = Column(Integer, default=1000) # Start with base ELO/Points
    
    # Logic: total_raw_score is just for stats (sum of raw Arduino scores)
    total_raw_score = Column(Integer, default=0) 

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    player1_id = Column(Integer, ForeignKey("players.id"))
    player2_id = Column(Integer, ForeignKey("players.id"))
    
    # Status: 'waiting', 'ongoing', 'finished'
    status = Column(String, default="waiting") 
    
    # Results (Nullable until match ends)
    score1 = Column(Integer, nullable=True)
    score2 = Column(Integer, nullable=True)
    winner_id = Column(Integer, ForeignKey("players.id"), nullable=True)
    
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)

    # Relationships for easy access
    player1 = relationship("Player", foreign_keys=[player1_id])
    player2 = relationship("Player", foreign_keys=[player2_id])