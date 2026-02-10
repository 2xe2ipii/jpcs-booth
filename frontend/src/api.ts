import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

// Helper to generate a fake ID so Backend doesn't crash
const generateId = (name: string) => {
  return name.toUpperCase().replace(/\s/g, '') + '_' + Math.floor(Math.random() * 9999);
};

export const api = {
  register: async (name: string) => {
    // Backend still needs an ID, so we make one up
    const fakeId = generateId(name);
    const res = await API.post('/players/register', { student_id: fakeId, name });
    return { ...res.data, student_id: fakeId }; 
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
  }
};