import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type Player } from '../api';

// --- SUB-COMPONENT: Player Card ---
const PlayerCard = ({ label, onLock, color }: { label: string, onLock: (player: Player) => void, color: string }) => {
  const [inputName, setInputName] = useState('');
  const [lockedPlayer, setLockedPlayer] = useState<Player | null>(null);
  const [suggestions, setSuggestions] = useState<Player[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Search Logic
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (inputName && !lockedPlayer && !inputName.includes('#')) {
        try {
            const results = await api.searchPlayers(inputName);
            setSuggestions(results);
            setShowDropdown(true);
        } catch(e) { console.error(e) }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [inputName, lockedPlayer]);

  const handleSelect = (player: Player) => {
    setLockedPlayer(player);
    setInputName(player.student_id);
    setShowDropdown(false);
    onLock(player);
  };

  const handleJoin = async () => {
    if (!inputName) return;
    try {
      // Logic: If user didn't pick from dropdown, create NEW
      if (!lockedPlayer) {
        const newPlayer = await api.register(inputName);
        handleSelect(newPlayer);
      }
    } catch (err) {
      alert("Oops! Can't join right now.");
    }
  };

  const handleUnjoin = () => {
    setLockedPlayer(null);
    setInputName('');
    onLock(null as any);
  };

  return (
    <div className={`flex-1 p-8 rounded-3xl border-4 border-black pop-card bg-white relative overflow-visible z-10`}>
      {/* Label Badge */}
      <div className={`absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full border-4 border-black font-black text-white uppercase tracking-wider ${color}`}>
        {label}
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        {lockedPlayer ? (
          <>
            <div className="text-4xl font-black text-gray-800">{lockedPlayer.student_id}</div>
            <div className={`text-2xl font-bold ${color.replace('bg-', 'text-')}`}>{lockedPlayer.total_points} PTS</div>
            <button 
              onClick={handleUnjoin}
              className="w-full py-3 rounded-xl border-4 border-black bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 uppercase transition-all"
            >
              Unjoin
            </button>
          </>
        ) : (
          <div className="w-full relative">
            <input 
              placeholder="YOUR NAME" 
              className="w-full p-4 text-center text-2xl font-bold border-b-4 border-gray-300 focus:border-black outline-none uppercase placeholder-gray-400"
              value={inputName} 
              onChange={e => { setInputName(e.target.value); setShowDropdown(true); }}
            />
            
            {/* Dropdown */}
            {showDropdown && inputName.length > 0 && (
              <ul className="absolute top-full left-0 right-0 bg-white border-4 border-black rounded-xl mt-2 z-50 max-h-48 overflow-y-auto shadow-lg">
                <li onClick={handleJoin} className="p-3 bg-blue-100 hover:bg-blue-200 cursor-pointer font-bold border-b-2 border-gray-100">
                  + CREATE "{inputName.toUpperCase()}"
                </li>
                {suggestions.map(p => (
                  <li key={p.id} onClick={() => handleSelect(p)} className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between">
                    <span className="font-bold">{p.student_id}</span>
                    <span>{p.total_points}</span>
                  </li>
                ))}
              </ul>
            )}

            <button 
              onClick={handleJoin}
              className={`mt-6 w-full py-3 rounded-xl border-4 border-black text-white font-black text-xl uppercase pop-card ${color} hover:brightness-110`}
            >
              JOIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [p1, setP1] = useState<Player | null>(null);
  const [p2, setP2] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!p1 || !p2) return;
    setLoading(true);
    try {
      await api.createMatch(p1.student_id, p2.student_id);
      navigate('/game');
    } catch (err) {
      alert("Can't start! Is a game already running?");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fun-bg flex flex-col items-center justify-center p-6 bg-[radial-gradient(#3b82f6_2px,transparent_2px)] [background-size:30px_30px]">
      
      {/* Fun Header */}
      <div className="mb-12 text-center transform -rotate-2">
        <h1 className="text-8xl font-black text-fun-yellow drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] [-webkit-text-stroke:3px_black]">
          WHACK.IO
        </h1>
        <p className="text-xl font-bold bg-black text-white inline-block px-4 py-1 rotate-2">
          JPCS FOUNDATION WEEK
        </p>
      </div>

      {/* Main Area */}
      <div className="flex flex-col md:flex-row gap-12 w-full max-w-5xl items-center mb-16">
        <PlayerCard label="Player 1" onLock={setP1} color="bg-fun-blue" />
        
        <div className="text-6xl font-black text-black italic drop-shadow-md">VS</div>
        
        <PlayerCard label="Player 2" onLock={setP2} color="bg-fun-green" />
      </div>

      <button 
        disabled={!p1 || !p2 || loading}
        onClick={handleStart}
        className="px-16 py-6 bg-fun-yellow text-black text-4xl font-black rounded-full border-[5px] border-black pop-card hover:scale-105 transition-transform disabled:opacity-50 disabled:grayscale disabled:scale-100"
      >
        {loading ? 'LOADING...' : 'START GAME!'}
      </button>

      <div onClick={() => navigate('/leaderboard')} className="mt-10 font-bold text-fun-blue hover:text-black cursor-pointer underline text-lg">
        Check Leaderboard
      </div>
    </div>
  );
}