from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import all_schemas
from app.crud import services
from app.models import all_models  # <--- FIXED: Added missing import

router = APIRouter(prefix="/matches", tags=["Matches"])

# 1. Create Match (Web Admin)
@router.post("/create", response_model=all_schemas.MatchResponse)
def create_new_match(match_data: all_schemas.MatchCreate, db: Session = Depends(get_db)):
    p1 = services.get_player_by_student_id(db, match_data.player1_student_id)
    p2 = services.get_player_by_student_id(db, match_data.player2_student_id)
    
    if not p1 or not p2:
        raise HTTPException(status_code=404, detail="One or both players not found")
        
    match = services.create_match(db, p1.id, p2.id)
    if not match:
        raise HTTPException(status_code=400, detail="Another match is currently ongoing!")
    return match

# 2. Get Current Match (Arduino checks this)
@router.get("/current", response_model=all_schemas.MatchResponse)
def get_active_match(db: Session = Depends(get_db)):
    match = services.get_current_match(db)
    if not match:
        raise HTTPException(status_code=404, detail="No active match")
    return match

# 3. Submit Score (Arduino posts this)
@router.post("/{match_id}/submit")
def submit_score(match_id: int, scores: all_schemas.ScoreSubmit, db: Session = Depends(get_db)):
    result = services.finish_match(db, match_id, scores)
    if not result:
        raise HTTPException(status_code=400, detail="Match not found or already finished")
    return {"message": "Scores recorded", "winner_id": result.winner_id}

# 4. EMERGENCY RESET (Fixes the stuck database)
@router.post("/reset")
def reset_matches(db: Session = Depends(get_db)):
    """Force finishes all ongoing matches so you can start a new one."""
    stuck_matches = db.query(all_models.Match).filter(all_models.Match.status == "ongoing").all()
    
    for match in stuck_matches:
        match.status = "finished"
        # Optional: Give them a dummy score so they don't look broken
        match.score1 = 0
        match.score2 = 0
    
    db.commit()
    return {"message": f"Reset complete. {len(stuck_matches)} matches force-finished."}