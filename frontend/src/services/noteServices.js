// src/services/noteService.js
import axios from 'axios';

const baseURL = '/api/notes';

const getAllNotes = async () => {
  const response = await axios.get(baseURL);
  return response.data;
};

// Implement other CRUD operations similarly

export default {
  getAllNotes,
  // Add other CRUD functions here
};
