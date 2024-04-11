import Container from "./container";
import { AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";

function Main() {

  return (
    <Container className="border w-[80%] md:w-[65%] border-slate-300 rounded-md p-6 mt-5 mb-20">
      <AnimatePresence mode="wait">
        <Outlet />
      </AnimatePresence>
    </Container>
  );
}

export default Main;
