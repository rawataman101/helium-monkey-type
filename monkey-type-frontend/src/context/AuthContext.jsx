import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const signup = async (username, email, password) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, {
      username,
      email,
      password,
    });
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
