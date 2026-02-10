from sqlalchemy.orm import Session
from app.models import all_models
from app.schemas import all_schemas
from datetime import datetime
import random
import string

# --- HELPER: Generate #ABCD Tag ---
def generate_discriminator():
    # Generates 4 random characters (e.g., "A1B2")
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))

# --- PLAYERS ---
def get_players_by_name(db: Session, name: str):
    # Case-insensitive search for players with this name
    return db.query(all_models.Player).filter(
        all_models.Player.name.ilike(name.strip())
    ).all()

def create_player(db: Session, player: all_schemas.PlayerCreate):
    clean_name = player.name.strip()
    
    # SCENARIO A: User selected an EXISTING player (passed the specific ID)
    if player.student_id:
        existing = db.query(all_models.Player).filter(
            all_models.Player.student_id == player.student_id
        ).first()
        if existing:
            return existing

    # SCENARIO B: Create NEW Player (Generate Random Tag)
    # Loop until we find a unique Tag (John#1234)
    while True:
        discriminator = generate_discriminator()
        new_tag = f"{clean_name}#{discriminator}"
        
        # Check if John#1234 already exists
        exists = db.query(all_models.Player).filter(
            all_models.Player.student_id == new_tag
        ).first()
        
        if not exists:
            # Found a unique one! Create it.
            db_player = all_models.Player(
                student_id=new_tag,  # John#A1B2
                name=clean_name,     # John
                total_points=0,      # <--- UPDATED: Starts at 0
                total_raw_score=0
            )
            db.add(db_player)
            db.commit()
            db.refresh(db_player)
            return db_player

def get_player_by_student_id(db: Session, student_id: str):
    return db.query(all_models.Player).filter(all_models.Player.student_id == student_id).first()

def get_leaderboard(db: Session):
    return db.query(all_models.Player).order_by(all_models.Player.total_points.desc()).all()

# --- MATCHES ---
def create_match(db: Session, p1_id: int, p2_id: int):
    # Check if a match is already running
    active_match = db.query(all_models.Match).filter(all_models.Match.status == "ongoing").first()
    if active_match:
        return None 
    
    new_match = all_models.Match(
        player1_id=p1_id,
        player2_id=p2_id,
        status="ongoing"
    )
    db.add(new_match)
    db.commit()
    db.refresh(new_match)
    return new_match

def get_current_match(db: Session):
    return db.query(all_models.Match).filter(all_models.Match.status == "ongoing").first()

def finish_match(db: Session, match_id: int, scores: all_schemas.ScoreSubmit):
    match = db.query(all_models.Match).filter(all_models.Match.id == match_id).first()
    if not match or match.status == "finished":
        return None

    # 1. Update Match Results
    match.score1 = scores.score1
    match.score2 = scores.score2
    match.status = "finished"
    match.ended_at = datetime.utcnow()

    # 2. Update Player Stats
    match.player1.total_raw_score += scores.score1
    match.player2.total_raw_score += scores.score2

    # 3. Apply Leaderboard Points
    if scores.score1 > scores.score2:
        match.winner_id = match.player1_id
        match.player1.total_points += 5
        match.player2.total_points -= 5
    elif scores.score2 > scores.score1:
        match.winner_id = match.player2_id
        match.player2.total_points += 5
        match.player1.total_points -= 5
    else:
        # Draw? No points change? (Or +1 each?)
        # Currently doing nothing for draw
        pass 

    db.commit()
    return match