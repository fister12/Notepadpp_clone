// Import dependencies
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import "./App.css"
import axios from 'axios'

// Define API call with chosen method (axios or fetch)
axios.get('http://localhost:5000/api/documents').then((response) => {
  // ... handle response data ...
}).catch((error) => {
  // ... handle error ...
});

// Server address
const ENDPOINT = 'http://localhost:5000';

// Document editor component
function DocumentEditor({ documentId }) {
  const [socket, setSocket] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);

  // Initialize socket connection and join document room on mount
  useEffect(() => {
    const newSocket = io(ENDPOINT);

    newSocket.on('init-document', (content) => {
      setDocumentContent(content);
      setCursorPosition(0);
    });

    const handleSave = async () => {
      // Send document content to backend for saving
      console.log('Saving document...'); // Replace with actual saving logic
    };

    newSocket.on('update-document', ({ content, position }) => {
      setDocumentContent(content);
      if (position !== undefined) {
        setCursorPosition(position);
      }
    });

    newSocket.emit('join-document', documentId);

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // Handle user edits and send updates to server
  const handleEdit = (event) => {
    const newContent = event.target.value;
    setDocumentContent(newContent);
    setCursorPosition(event.target.selectionStart);

    socket.emit('edit-document', {
      content: newContent,
      position: event.target.selectionStart,
    });
  };

  return (
    <div>
      <textarea
        rows="10"
        cols="50"
        value={documentContent}
        onChange={handleEdit}
        selectionStart={cursorPosition}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
  
}

// Render the document editor
function App() {
  return (
    <DocumentEditor documentId="123" />
  );
}

export default App;
