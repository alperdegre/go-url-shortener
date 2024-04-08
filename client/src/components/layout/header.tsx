import Container from "./container";
import NavButton from "../ui/navButton";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

function Header() {
  const { loggingOut, logout, userID } = useContext(AuthContext);

  return (
    <header className="w-full py-4 mt-20">
      <Container className="flex justify-between items-center">
        <h1 className="text-4xl uppercase font-bold tracking-wider">
          <span className="text-[#00ADD8] pr-3">Go</span>
          <span className="font-normal">URL Shortener</span>
        </h1>
        <div className="flex items-center gap-4">
          <NavButton key={"HOME"} to={"/"} text={"Home"} />
          <NavButton key={"ABOUT"} to={"/about"} text={"About"} />
          {!userID && <NavButton key={"LOGIN"} to={"/login"} text={"Login"} />}
          {userID && (
            <NavButton key={"DASHBOARD"} to={"/dashboard"} text={"My Links"} />
          )}
          {userID && (
            <button
              key={"LOGOUT"}
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
