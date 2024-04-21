// useAuth.js
import { useState } from 'react';
import axios from 'axios';

export function useAuth() {
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    const response = await axios.post('/api/login', { email, password });
    setToken(response.data.token);
  };

  const logout = () => {
    setToken(null);
  };

  return {
    token,
    login,
    logout,
  };
}