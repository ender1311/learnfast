import axios from 'axios';

const openai = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const createCompletion = async (input) => {
  try {
    const response = await openai.post('/completions', { input });
    return response.data;
  } catch (error) {
    console.error('Error fetching completion:', error);
    throw error;
  }
};

export default {
  createCompletion,
};
