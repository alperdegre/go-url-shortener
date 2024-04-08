import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

interface Props {
  key: string;
  to: string;
  text: string;
}

function NavButton({ key, to, text }: Props) {
  const location = useLocation();
  const { loggingOut } = useContext(AuthContext);

  return (
    <Link
      key={key}
      to={to}
      className="uppercase text-xl tracking-wide relative"
    >
      {text}
      {location.pathname === to && !loggingOut ? (
        <motion.div className="underline" layoutId="underline" />
      ) : null}
    </Link>
  );
}

export default NavButton;
