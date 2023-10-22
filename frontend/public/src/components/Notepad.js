// Notepad.js
import React, { useState, useEffect } from 'react';
import { getNotepadContent, saveNotepadContent } from './api';

function Notepad({ notepadId, username }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    getNotepadContent(notepadId)
      .then((response) => {
        setContent(response.data.content);
      })
      .catch((error) => {
        console.error('Error fetching notepad content:', error);
      });
  }, [notepadId]);

  const handleSave = () => {
    saveNotepadContent(notepadId, content, username)
      .then(() => {
        // Handle save success
      })
      .catch((error) => {
        console.error('Error saving notepad:', error);
      });
  };

  return (
    <div>
      <h2>Notepad {notepadId}</h2>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default Notepad;
