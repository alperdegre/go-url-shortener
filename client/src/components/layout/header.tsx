import Container from "./container";
import NavButton from "../ui/navButton";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";

function Header() {
  const { loggingOut, logout, userID } = useContext(AuthContext);

  return (
    <header className="w-full py-4 mt-10 md:mt-20">
      <Container className="flex justify-between items-center flex-col lg:flex-row gap-4 lg:gap-0">
        <Link to="/" className="text-4xl uppercase font-bold tracking-wider">
          <span className="text-golang pr-2">Go</span>
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
                <motion.div className="underline" layoutId="underline" />
              ) : null}
            </button>
          )}
        </div>
      </Container>
    </header>
  );
}

export default Header;
