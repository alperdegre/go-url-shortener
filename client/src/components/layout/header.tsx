import Container from "./container";
import NavButton from "../ui/navButton";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import { LangContext } from "@/context/langContext";
import { Language } from "@/lib/types";
import LanguageSwitch from "../ui/language_switch";

function Header() {
  const { loggingOut, logout, userID } = useContext(AuthContext);
  const { language } = useContext(LangContext);

  return (
    <header className="w-full py-4 mt-10 md:mt-20">
      <Container className="flex justify-between items-center flex-col lg:flex-row gap-4 lg:gap-0">
        <Link to="/" className="text-4xl uppercase font-bold tracking-wider">
          {language === Language.GO ? <span className="text-golang pr-2">Go</span> : <span className="text-python pr-2">Python</span>}
          <span className="font-normal">URL Shortener</span>
        </Link>
        <div className="flex items-center gap-4">
          <NavButton to={"/"} text={"Home"} />
          {!userID && <NavButton to={"/login"} text={"Login"} />}
          {userID && (
            <NavButton to={"/shorten"} text={"Shorten"} />
          )}
          {userID && (
            <NavButton to={"/dashboard"} text={"My Links"} />
          )}
          {userID && (
            <button
              className="uppercase text-xl tracking-wide relative"
              onClick={logout}
            >
              Logout
              {loggingOut ? (
                <motion.div className={language === Language.GO ? "go_underline" : "python_underline"} layoutId="underline" />
              ) : null}
            </button>
          )}
          <LanguageSwitch />
        </div>
      </Container>
    </header>
  );
}

export default Header;
