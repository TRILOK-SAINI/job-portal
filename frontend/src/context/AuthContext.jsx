import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const API = `${import.meta.env.VITE_API_URL}`;
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

const checkAuth = async () => {
  try {
    const res = await axios.get(`${API}/auth/me`, {
      withCredentials: true,
    });

    setUser(res.data.user);
    return res.data.user; // <-- ADD THIS RETURN STATEMENT
  } catch (error) {
    setUser(null);
    return null; // <-- ADD THIS RETURN STATEMENT
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        `${API}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);