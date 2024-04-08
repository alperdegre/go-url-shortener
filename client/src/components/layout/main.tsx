import Container from "./container";
import { AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

function Main() {
  let location = useLocation();
  console.log(location);
  
  return (
    <Container className="border w-3/5 border-slate-300 rounded-md p-6 mt-5">
      <AnimatePresence mode="wait">
          <Outlet />
      </AnimatePresence>
    </Container>
  );
}

export default Main;
