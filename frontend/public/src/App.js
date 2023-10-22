// App.js
import React, { useState } from 'react';
import UserRegistration from './UserRegistration';
import Notepad from './Notepad';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [notepadId, setNotepadId] = useState('1');

  const handleUserRegistered = (user) => {
    setUsername(user);
  }

  return (
    <div>
      {username ? (
        <Notepad notepadId={notepadId} username={username} />
      ) : (
        <UserRegistration onUserRegistered={handleUserRegistered} />
      )}
    </div>
  );
}

export default App;
