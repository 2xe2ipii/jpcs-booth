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
    <div className="min-h-screen bg-fun-bg p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white border-[6px] border-black rounded-3xl p-8 pop-card">
        
        <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
            <h1 className="text-5xl font-black text-black italic">
                TOP PLAYERS
            </h1>
            <button onClick={() => navigate('/')} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 border-2 border-black rounded-lg font-bold">
                Back
            </button>
        </div>

        <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
                <tr className="text-gray-500 uppercase text-sm tracking-wider">
                    <th className="p-4">Rank</th>
                    <th className="p-4">Player</th>
                    <th className="p-4 text-right">Points</th>
                </tr>
            </thead>
            <tbody>
                {players.map((p, index) => {
                    const colors = ['bg-fun-yellow', 'bg-gray-300', 'bg-orange-300'];
                    const bgColor = index < 3 ? colors[index] : 'bg-white border-2 border-gray-100';
                    const textColor = index < 3 ? 'text-black' : 'text-gray-700';
                    
                    return (
                        <tr key={index} className={`${bgColor} rounded-xl shadow-sm ${index < 3 ? 'border-4 border-black' : ''}`}>
                            <td className={`p-4 font-black text-2xl ${textColor} rounded-l-xl`}>
                                #{index + 1}
                            </td>
                            <td className="p-4">
                                <div className={`text-xl font-bold ${textColor}`}>{p.name}</div>
                                <div className="text-xs font-mono opacity-70">{p.student_id}</div>
                            </td>
                            <td className={`p-4 text-right font-black text-2xl ${textColor} rounded-r-xl`}>
                                {p.total_points}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>

      </div>
    </div>
  );
}