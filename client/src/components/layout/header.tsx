import Container from "./container";
import { useContext } from "react";
import { PageState } from "@/lib/types";
import { Link, useNavigate } from "react-router-dom";

function Header() {

  return (
    <header className="w-full py-4 mt-20">
      <Container className="flex justify-between items-center">
        <h1 className="text-4xl uppercase font-bold tracking-wider">
          <span className="text-[#00ADD8] pr-3">Go</span>
          <span className="font-normal">URL Shortener</span>
        </h1>
        <div className="flex items-center gap-4">
          <Link
            key={"HOME"}
            to={"/"}
            className="uppercase text-xl tracking-wide font-semibold hover:underline"
          >
            Home
          </Link>
          <Link
            key={"LOGIN"}
            to={"/login"}
            className="uppercase text-xl tracking-wide font-semibold hover:underline"
          >
            Login
          </Link>
          <Link
            key={"ABOUT"}
            to={"/about"}
            className="uppercase text-xl tracking-wide font-semibold hover:underline"
          >
            About
          </Link>
          <Link
            key={"DASHBOARD"}
            to={"/dashboard"}    
            className="uppercase text-xl tracking-wide font-semibold hover:underline"
          >
            My Links
          </Link>
          <button
            key={"LOGOUT"}
            className="uppercase text-xl tracking-wide font-semibold hover:underline"
          >
            Logout
          </button>
        </div>
      </Container>
    </header>
  );
}

export default Header;
