
import React, { useState, useEffect } from 'react';
import NoteList from './components/NoteList';
import apiService from './services/apiService';

function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notesFromServer = await apiService.get('/notes');
        setNotes(notesFromServer.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div>
      <h1>Notepad Clone App</h1>
      <NoteList notes={notes} />
    </div>
  );
}

export default App;
