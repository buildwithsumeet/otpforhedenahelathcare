import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUsers } from '../Api/currentUserApi';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user: object (profile, role, etc)

  // Persist user session across refresh
  useEffect(() => {
   const response  = getCurrentUsers();
    response.then((data) => {
      console.log("Current User Data:", data.user);
      if (data.user) {
        setUser(data.user); // Set user from API response
      } else {
        console.error(data.message);
      }
    }).catch((error) => {
      console.error("Error fetching current user:", error);
    });
  }, []);

  // Set user after login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Clear user on logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
