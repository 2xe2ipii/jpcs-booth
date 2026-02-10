import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    api.getLeaderboard().then(setPlayers);
  }, []);

  return (
    <div className="min-h-screen bg-black p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl border-4 border-gold-600 rounded-lg p-1 bg-gold-600">
        <div className="bg-casino-green w-full h-full p-8 rounded border-2 border-black">
            
            <div className="flex justify-between items-center mb-10 border-b-2 border-gold-600/50 pb-4">
                <h1 className="text-4xl md:text-5xl font-black text-gold-400 uppercase tracking-widest drop-shadow-lg">
                    Leaderboard
                </h1>
                <button onClick={() => navigate('/')} className="text-gold-500 hover:text-white font-serif italic">
                    Return to Lobby &rarr;
                </button>
            </div>

            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-gold-600 uppercase text-sm tracking-wider border-b border-gold-600/30">
                        <th className="p-4">Rank</th>
                        <th className="p-4">Player</th>
                        <th className="p-4 text-right">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((p, index) => (
                        <tr key={index} className="hover:bg-black/20 transition-colors">
                            <td className="p-4 font-serif text-2xl text-white/50">
                                {index + 1 === 1 ? '👑' : `#${index + 1}`}
                            </td>
                            <td className="p-4 text-xl font-bold text-white font-serif">
                                {p.name}
                            </td>
                            <td className="p-4 text-right font-mono text-2xl text-gold-400">
                                ${p.total_points}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
      </div>
    </div>
  );
}