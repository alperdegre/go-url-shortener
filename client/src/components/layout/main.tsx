import { useContext } from "react";
import Container from "./container";
import { PageContext } from "../context/pageContext";
import { motion, AnimatePresence } from "framer-motion";
import Home from "../pages/home";
import { PageState } from "@/lib/types";
import Dashboard from "../pages/dashboard";
import SignUp from "../pages/signup";
import Login from "../pages/login";
import About from "../pages/about";

function Main() {
  const { page } = useContext(PageContext);

  return (
    <Container className="border w-3/5 border-slate-300 rounded-md p-6 mt-10">
      <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {page === PageState.HOME && <Home />}
            {page === PageState.LOGIN && <Login />}
            {page === PageState.ABOUT && <About />}
            {page === PageState.SIGNUP && <SignUp />}
            {page === PageState.DASHBOARD && <Dashboard />}
          </motion.div>
      </AnimatePresence>
    </Container>
  );
}

export default Main;
