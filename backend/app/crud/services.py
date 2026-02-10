from sqlalchemy.orm import Session
from app.models import all_models
from app.schemas import all_schemas
from datetime import datetime

# --- PLAYERS ---
def create_player(db: Session, player: all_schemas.PlayerCreate):
    db_player = all_models.Player(
        student_id=player.student_id, 
        name=player.name
    )
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

def get_player_by_student_id(db: Session, student_id: str):
    return db.query(all_models.Player).filter(all_models.Player.student_id == student_id).first()

def get_leaderboard(db: Session):
    # Sort by total_points descending
    return db.query(all_models.Player).order_by(all_models.Player.total_points.desc()).all()

# --- MATCHES ---
def create_match(db: Session, p1_id: int, p2_id: int):
    # Ensure no other match is 'ongoing' (Hardware constraint)
    active_match = db.query(all_models.Match).filter(all_models.Match.status == "ongoing").first()
    if active_match:
        return None # Or raise error
    
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

    # 1. Save Raw Scores
    match.score1 = scores.score1
    match.score2 = scores.score2
    match.status = "finished"
    match.ended_at = datetime.utcnow()

    # 2. Update Player Totals (Raw)
    match.player1.total_raw_score += scores.score1
    match.player2.total_raw_score += scores.score2

    # 3. Apply The Rule (+5 / -5)
    # Note: We use 1000 as base points in Model to avoid negative numbers, 
    # but regular +/- works too.
    
    if scores.score1 > scores.score2:
        match.winner_id = match.player1_id
        match.player1.total_points += 5
        match.player2.total_points -= 5
    elif scores.score2 > scores.score1:
        match.winner_id = match.player2_id
        match.player2.total_points += 5
        match.player1.total_points -= 5
    else:
        # Draw (Optional: +1 each? 0?)
        pass 

    db.commit()
    return match