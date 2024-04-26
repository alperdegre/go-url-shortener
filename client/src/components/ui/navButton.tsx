import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Language } from "@/lib/types";
import { LangContext } from "@/context/langContext";

interface Props {
  to: string;
  text: string;
  key?: string;
}

function NavButton({ to, text, key }: Props) {
  const location = useLocation();
  const { loggingOut } = useContext(AuthContext);
  const { language } = useContext(LangContext);

  return (
    <Link
      key={key}
      to={to}
      className="uppercase text-xl tracking-wide relative"
    >
      {text}
      {location.pathname === to && !loggingOut ? (
        <motion.div className={language === Language.GO ? "go_underline" : "python_underline"} layoutId="underline" />
      ) : null}
    </Link>
  );
}

export default NavButton;
