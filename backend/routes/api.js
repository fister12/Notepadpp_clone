// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Update with your backend server URL
});

export const getNotepadContent = (notepadId) => {
  return api.get(`/api/notepad/${notepadId}`);
};

export const saveNotepadContent = (notepadId, content) => {
  return api.post(`/api/notepad/${notepadId}`, { content });
};


