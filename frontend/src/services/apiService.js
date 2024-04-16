import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'; // Update with your backend URL

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllNotes = async () => {
  try {
    const response = await apiService.get('/notes');
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

// Implement other CRUD operations similarly

export default apiService;