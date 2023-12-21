import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to get the user from localStorage when the context is created
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return { isLoggedIn: false, username: null, role: null };
  });

  useEffect(() => {
    // Save the user to localStorage whenever it changes
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const logout = () => {
    setUser({ isLoggedIn: false, username: null, role: null });
    localStorage.removeItem('user'); // Remove user from localStorage on logout
    // If you have any other cleanup to do on logout, add it here
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
