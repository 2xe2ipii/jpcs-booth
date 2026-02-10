import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export interface Player {
  id: number;
  student_id: string; 
  name: string;      
  total_points: number;
}

// Helper to generate a fake ID so Backend doesn't crash
const generateId = (name: string) => {
  // Generates "JOHN_4921" from "John"
  return name.toUpperCase().replace(/\s/g, '') + '_' + Math.floor(Math.random() * 9999);
};

export const api = {
  // Search for existing players
  searchPlayers: async (name: string): Promise<Player[]> => {
    if (!name) return [];
    const res = await API.get(`/players/search?name=${name}`);
    return res.data;
  },

  // Register: Generates a random ID if one isn't provided
  register: async (name: string, existingId?: string) => {
    // CRITICAL FIX: If no existingId, generate a random one.
    const finalId = existingId || generateId(name);
    
    const res = await API.post('/players/register', { 
      name: name, 
      student_id: finalId 
    });
    return res.data;
  },

  createMatch: async (p1Id: string, p2Id: string) => {
    const res = await API.post('/matches/create', { 
      player1_student_id: p1Id, 
      player2_student_id: p2Id 
    });
    return res.data;
  },

  getCurrentMatch: async () => {
    try {
      const res = await API.get('/matches/current');
      return res.data;
    } catch (error) {
      return null;
    }
  },

  getLeaderboard: async () => {
    const res = await API.get('/players/leaderboard');
    return res.data;
  },

  // The Reset Button (Keep this for safety!)
  resetMatches: async () => {
    const res = await API.post('/matches/reset');
    return res.data;
  }
};