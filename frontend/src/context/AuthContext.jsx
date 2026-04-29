import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("otp_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = (userPayload) => {
    setUser(userPayload);
    localStorage.setItem("otp_user", JSON.stringify(userPayload));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("otp_user");
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
