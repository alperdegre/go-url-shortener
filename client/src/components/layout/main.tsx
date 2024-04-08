import Container from "./container";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

function Main() {
  let location = useLocation();
  console.log(location);
  
  return (
    <Container className="border w-3/5 border-slate-300 rounded-md p-6 mt-10">
      <AnimatePresence mode="wait">
          <Outlet />
          {/* {page === PageState.HOME && <Home />}
          {page === PageState.LOGIN && <Login />}
          {page === PageState.ABOUT && <About />}
          {page === PageState.SIGNUP && <SignUp />}
          {page === PageState.DASHBOARD && <Dashboard />} */}
      </AnimatePresence>
    </Container>
  );
}

export default Main;
