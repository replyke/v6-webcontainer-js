import { useEffect, useState } from "react";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { AuthContext } from "./auth-context";

const USERNAME_KEY = "demo_username";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUsername = localStorage.getItem(USERNAME_KEY);
    if (savedUsername) {
      setUser({
        id: savedUsername,
        username: savedUsername,
      });
    }
    setLoading(false);
  }, []);

  const setUsername = (username) => {
    localStorage.setItem(USERNAME_KEY, username);
    setUser({
      id: username,
      username: username,
    });
  };

  const generateRandomUsername = () => {
    const randomUsername = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: "-",
      length: 3,
      style: "lowerCase",
    });
    return randomUsername;
  };

  const clearUsername = () => {
    localStorage.removeItem(USERNAME_KEY);
    setUser(null);
  };

  const value = {
    user,
    loading,
    setUsername,
    generateRandomUsername,
    clearUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
