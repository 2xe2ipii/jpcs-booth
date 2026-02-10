import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Game() {
  const navigate = useNavigate();
  const [match, setMatch] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const currentMatch = await api.getCurrentMatch();
      if (currentMatch) setMatch(currentMatch);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!match) return (
    <div className="min-h-screen bg-fun-bg flex items-center justify-center text-4xl font-black text-fun-blue">
      GETTING READY...
    </div>
  );

  const isFinished = match.status === 'finished';

  return (
    <div className="min-h-screen bg-fun-bg flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* TITLE - No pulsing, just big and bold */}
      <div className="text-6xl md:text-8xl font-black text-black mb-12 uppercase text-center tracking-tighter">
        {isFinished ? 'GAME OVER' : 'PLAYING'}
      </div>

      <div className="flex w-full max-w-6xl justify-center gap-10 md:gap-32 items-center z-10">
        
        {/* PLAYER 1 SCORE - Static, no rotation or scaling */}
        <div className="flex flex-col items-center">
            <div className={`bg-fun-blue border-[6px] border-black rounded-3xl p-10 min-w-[280px] text-center ${isFinished && match.winner_id === match.player1.id ? 'ring-8 ring-yellow-400' : ''}`}>
                <h2 className="text-3xl text-white font-black uppercase mb-4 tracking-tight">{match.player1.name}</h2>
                <div className="bg-white rounded-xl p-4 border-4 border-black/20">
                    <span className="text-8xl font-mono font-black text-fun-blue block leading-none">
                        {isFinished ? match.score1 : "..."}
                    </span>
                </div>
            </div>
            {isFinished && match.winner_id === match.player1.id && (
                <div className="mt-6 px-8 py-3 bg-fun-yellow text-black font-black text-2xl border-4 border-black rounded-full uppercase">
                    WINNER
                </div>
            )}
        </div>

        {/* PLAYER 2 SCORE - Static, no rotation or scaling */}
        <div className="flex flex-col items-center">
            <div className={`bg-fun-green border-[6px] border-black rounded-3xl p-10 min-w-[280px] text-center ${isFinished && match.winner_id === match.player2.id ? 'ring-8 ring-yellow-400' : ''}`}>
                <h2 className="text-3xl text-white font-black uppercase mb-4 tracking-tight">{match.player2.name}</h2>
                <div className="bg-white rounded-xl p-4 border-4 border-black/20">
                    <span className="text-8xl font-mono font-black text-fun-green block leading-none">
                        {isFinished ? match.score2 : "..."}
                    </span>
                </div>
            </div>
            {isFinished && match.winner_id === match.player2.id && (
                <div className="mt-6 px-8 py-3 bg-fun-yellow text-black font-black text-2xl border-4 border-black rounded-full uppercase">
                    WINNER
                </div>
            )}
        </div>

      </div>

      {isFinished && (
        <button 
            onClick={() => navigate('/')}
            className="mt-20 px-12 py-5 bg-black text-white font-black text-2xl rounded-full uppercase tracking-wide"
        >
            PLAY AGAIN
        </button>
      )}
    </div>
  );
}