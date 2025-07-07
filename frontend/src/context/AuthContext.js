import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true'; // Convert string to boolean

    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUser({ username: storedUsername, isAdmin: storedIsAdmin });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { username, password });
      const { token, username: returnedUsername, isAdmin } = res.data;
      setToken(token);
      setUser({ username: returnedUsername, isAdmin });
      localStorage.setItem('token', token);
      localStorage.setItem('username', returnedUsername);
      localStorage.setItem('isAdmin', isAdmin);
      return { success: true, isAdmin }; // Return isAdmin status
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      return { success: false, isAdmin: false };
    }
  };

  const register = async (username, password) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, { username, password });
      const { token, username: returnedUsername, isAdmin } = res.data;
      setToken(token);
      setUser({ username: returnedUsername, isAdmin });
      localStorage.setItem('token', token);
      localStorage.setItem('username', returnedUsername);
      localStorage.setItem('isAdmin', isAdmin);
      return { success: true, isAdmin }; // Return isAdmin status
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
      return { success: false, isAdmin: false };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
  };

  // Axios Interceptor for authenticated requests
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);