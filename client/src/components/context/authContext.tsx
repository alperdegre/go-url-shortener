import { JWTExpiry, JWTToken, PageState, UserID } from "@/lib/types";
import { createContext, useContext, useEffect, useState } from "react";
import { PROTECTED_ROUTES } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthContextType {
  token: JWTToken;
  userID: UserID;
  login: (token: JWTToken, userID: UserID, expiry: JWTExpiry) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  userID: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<JWTToken>(null);
  const [userID, setUserID] = useState<UserID>(null);
  const [expiry, setExpiry] = useState<JWTExpiry>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      const remainingTime = parsedData.expiry - Date.now();
      if (remainingTime < 0) {
        logout();
        navigate("/login");
      } else {
        setToken(parsedData.token);
        setUserID(parsedData.userID);
        setExpiry(parsedData.expiry);
        navigate("/dashboard");
      }
    }
  }, []);

  useEffect(() => {
    if (PROTECTED_ROUTES.includes(location.pathname) && !token) {
      navigate("/login");
    }

    if (
      (location.pathname === "/login" || location.pathname === "/signup") &&
      token
    ) {
      navigate("/dashboard");
    }

    if (expiry) {
      const remainingTime = expiry - Math.floor(Date.now() / 1000);
      if (remainingTime < 0) {
        logout();
      } else {
        const timer = setTimeout(logout, remainingTime);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname]);

  const login = (token: JWTToken, userID: UserID, expiry: JWTExpiry) => {
    setToken(token);
    setUserID(userID);
    setExpiry(expiry);
    localStorage.setItem("userData", JSON.stringify({ token, userID, expiry }));
  };

  const logout = () => {
    setToken(null);
    setUserID(null);
    setExpiry(null);
    localStorage.removeItem("userData");
  };

  return (
    <AuthContext.Provider value={{ token, userID, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
