import React from "react";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

function MotionContainer({ children }: Props) {
  return (
    <motion.div
      key={location.pathname}
      initial={{ x: 10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -10, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export default MotionContainer;
