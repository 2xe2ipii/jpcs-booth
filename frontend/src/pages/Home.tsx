import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Home() {
  const navigate = useNavigate();
  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  
  // Locking states
  const [p1Locked, setP1Locked] = useState(false);
  const [p2Locked, setP2Locked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!p1Locked || !p2Locked) return;
    setLoading(true);
    try {
      // 1. Register players
      const p1 = await api.register(p1Name);
      const p2 = await api.register(p2Name);
      
      // 2. Create Match (Tells Arduino to wake up)
      await api.createMatch(p1.student_id, p2.student_id);
      
      navigate('/game');
    } catch (err) {
      console.error(err);
      alert("Could not start game.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] bg-[radial-gradient(#3a3a3a_1px,transparent_1px)] [background-size:20px_20px] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Title */}
      <h1 className="text-7xl font-serif font-black text-[#f59e0b] mb-12 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] border-b-4 border-[#8a0000] pb-4">
        WHACK.IO
      </h1>

      <div className="flex flex-col md:flex-row gap-12 w-full max-w-6xl z-10">
        
        {/* PLAYER 1 PANEL */}
        <div className={`flex-1 p-8 rounded-xl border-4 transition-all duration-300 ${p1Locked ? 'bg-[#0b3d0b] border-[#f59e0b] shadow-[0_0_30px_#0b3d0b]' : 'bg-black border-gray-700'}`}>
          <h2 className="text-3xl font-bold text-white mb-6 text-center font-serif">PLAYER 1</h2>
          
          <input 
            disabled={p1Locked}
            placeholder="ENTER NAME" 
            className="w-full p-4 bg-gray-100 text-black text-2xl font-bold text-center border-none outline-none mb-6 uppercase tracking-wider disabled:bg-gray-400"
            value={p1Name} 
            onChange={e => setP1Name(e.target.value)}
          />
          
          <button 
            onClick={() => setP1Locked(!p1Locked)}
            className={`w-full py-4 text-xl font-black uppercase tracking-widest rounded ${p1Locked ? 'bg-red-900 text-red-200 hover:bg-red-800' : 'bg-[#f59e0b] text-black hover:bg-yellow-400'}`}
          >
            {p1Locked ? 'UNJOIN' : 'JOIN'}
          </button>
        </div>

        {/* VS SIGN */}
        <div className="flex items-center justify-center">
             <div className="w-24 h-24 rounded-full bg-[#8a0000] border-4 border-[#f59e0b] flex items-center justify-center text-4xl font-black text-[#f59e0b] shadow-xl italic">VS</div>
        </div>

        {/* PLAYER 2 PANEL */}
        <div className={`flex-1 p-8 rounded-xl border-4 transition-all duration-300 ${p2Locked ? 'bg-[#0b3d0b] border-[#f59e0b] shadow-[0_0_30px_#0b3d0b]' : 'bg-black border-gray-700'}`}>
          <h2 className="text-3xl font-bold text-white mb-6 text-center font-serif">PLAYER 2</h2>
          
          <input 
            disabled={p2Locked}
            placeholder="ENTER NAME" 
            className="w-full p-4 bg-gray-100 text-black text-2xl font-bold text-center border-none outline-none mb-6 uppercase tracking-wider disabled:bg-gray-400"
            value={p2Name} 
            onChange={e => setP2Name(e.target.value)}
          />
          
          <button 
            onClick={() => setP2Locked(!p2Locked)}
            className={`w-full py-4 text-xl font-black uppercase tracking-widest rounded ${p2Locked ? 'bg-red-900 text-red-200 hover:bg-red-800' : 'bg-[#f59e0b] text-black hover:bg-yellow-400'}`}
          >
            {p2Locked ? 'UNJOIN' : 'JOIN'}
          </button>
        </div>

      </div>

      {/* START BUTTON */}
      <button 
        disabled={!p1Locked || !p2Locked || loading}
        onClick={handleStart}
        className="mt-16 px-16 py-6 bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-black text-4xl font-black rounded-full shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:scale-105 hover:shadow-[0_0_60px_rgba(245,158,11,0.8)] transition-all uppercase tracking-widest disabled:opacity-30 disabled:scale-100"
      >
        {loading ? 'Starting' : 'START'}
      </button>

      <div onClick={() => navigate('/leaderboard')} className="mt-8 text-[#f59e0b] underline cursor-pointer hover:text-white tracking-widest uppercase">
        Leaderboard
      </div>
    </div>
  );
}