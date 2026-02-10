import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Game() {
  const navigate = useNavigate();
  const [match, setMatch] = useState<any>(null);

  // Polling for updates
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentMatch = await api.getCurrentMatch();
      if (currentMatch) setMatch(currentMatch);
    }, 1000); // Check server every second
    return () => clearInterval(interval);
  }, []);

  if (!match) return <div className="min-h-screen bg-black flex items-center justify-center text-[#f59e0b] text-2xl animate-pulse">Connecting...</div>;

  const isFinished = match.status === 'finished';

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black z-0"></div>

      <h1 className={`text-6xl font-black text-[#f59e0b] mb-16 uppercase tracking-[0.5em] z-10 ${!isFinished ? 'animate-pulse' : ''}`}>
        {isFinished ? 'JACKPOT!' : 'GAME LIVE'}
      </h1>

      <div className="flex w-full max-w-6xl justify-around z-10">
        
        {/* PLAYER 1 SLOT */}
        <div className={`flex flex-col items-center transition-transform duration-500 ${isFinished && match.winner_id === match.player1.id ? 'scale-110' : ''}`}>
            <h2 className="text-4xl text-white font-serif font-bold mb-4">{match.player1.name}</h2>
            <div className="bg-[#1a1a1a] border-8 border-[#d97706] rounded-2xl p-8 min-w-[250px] flex justify-center items-center shadow-[0_0_40px_rgba(217,119,6,0.3)]">
                <span className="text-8xl font-mono font-black text-red-600 drop-shadow-lg">
                    {isFinished ? match.score1.toString().padStart(3, '0') : "..."}
                </span>
            </div>
            {isFinished && match.winner_id === match.player1.id && (
                <div className="mt-6 px-8 py-2 bg-[#f59e0b] text-black font-black text-xl rounded-full animate-bounce">WINNER (+5)</div>
            )}
        </div>

        {/* PLAYER 2 SLOT */}
        <div className={`flex flex-col items-center transition-transform duration-500 ${isFinished && match.winner_id === match.player2.id ? 'scale-110' : ''}`}>
            <h2 className="text-4xl text-white font-serif font-bold mb-4">{match.player2.name}</h2>
            <div className="bg-[#1a1a1a] border-8 border-[#d97706] rounded-2xl p-8 min-w-[250px] flex justify-center items-center shadow-[0_0_40px_rgba(217,119,6,0.3)]">
                <span className="text-8xl font-mono font-black text-red-600 drop-shadow-lg">
                    {isFinished ? match.score2.toString().padStart(3, '0') : "..."}
                </span>
            </div>
            {isFinished && match.winner_id === match.player2.id && (
                <div className="mt-6 px-8 py-2 bg-[#f59e0b] text-black font-black text-xl rounded-full animate-bounce">WINNER (+5)</div>
            )}
        </div>

      </div>

      {isFinished && (
        <button 
            onClick={() => navigate('/')}
            className="mt-20 z-10 px-12 py-4 border-2 border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-black font-bold text-2xl rounded transition-colors uppercase tracking-widest"
        >
            RETURN
        </button>
      )}
    </div>
  );
}