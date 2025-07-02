import { createContext, useState, useEffect } from "react";
import { getToken, saveToken, removeToken, decodeToken } from "../utils/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      const decodedUser = decodeToken(storedToken);
      if (decodedUser) {
        setToken(storedToken);
        setUser(decodedUser);
      }
    }
  }, []);

  const login = (newToken) => {
    const decodedUser = decodeToken(newToken);
    if (decodedUser) {
      saveToken(newToken);
      setToken(newToken);
      setUser(decodedUser);
    }
  };

  const logout = () => {
    removeToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
