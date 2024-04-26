import { JWTExpiry, JWTToken, Language, UserID } from "@/lib/types";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { PROTECTED_ROUTES } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { LangContext } from "./langContext";

interface AuthContextType {
  token: JWTToken;
  userID: UserID;
  loggingOut: boolean;
  login: (token: JWTToken, userID: UserID, expiry: JWTExpiry) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  userID: null,
  loggingOut: false,
  login: () => { },
  logout: () => { },
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<JWTToken>(null);
  const [userID, setUserID] = useState<UserID>(null);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useContext(LangContext);

  useEffect(() => {
    checkAuth(language)
  }, []);

  useEffect(() => {
    checkAuth(language)
  }, [language])

  useEffect(() => {
    if (PROTECTED_ROUTES.includes(location.pathname) && !token) {
      navigate("/");
    }

    if (
      (location.pathname === "/login" || location.pathname === "/signup") &&
      token
    ) {
      navigate("/dashboard");
    }
  }, [location.pathname, navigate, token]);

  const checkAuth = (newLang: Language) => {
    const userData = localStorage.getItem(`userData_${newLang}`);
    if (userData) {
      const parsedData = JSON.parse(userData);
      const remainingTime = parsedData.expiry - Math.floor(Date.now() / 1000);
      if (remainingTime < 0) {
        logout();
        navigate("/login");
      } else {
        const timer = setTimeout(logout, remainingTime);
        setToken(parsedData.token);
        setUserID(parsedData.userID);
        navigate("/dashboard");

        return () => clearTimeout(timer);
      }
    } else {
      console.log("out")
      if (PROTECTED_ROUTES.includes(location.pathname)) {
        logout()
      } else {
        setToken(null)
        setUserID(null)
      }
    }
  }

  const login = (token: JWTToken, userID: UserID, expiry: JWTExpiry) => {
    setToken(token);
    setUserID(userID);
    localStorage.setItem(`userData_${language}`, JSON.stringify({ token, userID, expiry }));
  };

  const logout = useCallback(() => {
    setLoggingOut(true);
    setToken(null);
    localStorage.removeItem(`userData_${language}`);
    setTimeout(() => {
      setLoggingOut(false);
      navigate("/");
      setUserID(null);
    }, 500);
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ token, userID, login, logout, loggingOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
