import axios from 'axios';

const API = axios.create({
  // Now it reads from the Vercel environment variable
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export interface Player {
  id: number;
  student_id: string; // This is the "John#A1B2" string
  name: string;       // This is just "John"
  total_points: number;
}

export const api = {
  // Search for existing Johns
  searchPlayers: async (name: string): Promise<Player[]> => {
    if (!name) return [];
    const res = await API.get(`/players/search?name=${name}`);
    return res.data;
  },

  // Register: Pass student_id if selecting existing, or null if new
  register: async (name: string, existingId?: string) => {
    const res = await API.post('/players/register', { 
      name: name, 
      student_id: existingId || null 
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

  // --- ADDED THIS FUNCTION ONLY ---
  // Calls the emergency reset endpoint we added to the backend
  resetMatches: async () => {
    const res = await API.post('/matches/reset');
    return res.data;
  }
};