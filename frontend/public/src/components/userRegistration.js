// UserRegistration.js
import React, { useState } from 'react';
import { registerUser } from './api';

function UserRegistration({ onUserRegistered }) {
  const [username, setUsername] = useState('');

  const handleRegister = () => {
    registerUser(username)
      .then(() => {
        onUserRegistered(username);
      })
      .catch((error) => {
        console.error('User registration failed:', error);
      });
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default UserRegistration;
