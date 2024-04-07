import Container from "./container";
import { useContext } from "react";
import { PageContext } from "../context/pageContext";
import { PageState } from "@/lib/types";

function Header() {
  const { changePage } = useContext(PageContext);

  return (
    <header className="w-full py-4 mt-20">
      <Container className="flex justify-between items-center">
        <h1 className="text-4xl uppercase font-bold tracking-wider">
          <span className="text-[#00ADD8] pr-3">Go</span>
          <span className="font-normal">URL Shortener</span>
        </h1>
        <div className="flex items-center gap-4">
          <button
            key={"HOME"}
            onClick={() => changePage(PageState.HOME)}
            className="uppercase text-xl tracking-wide font-semibold hover:underline"
          >
            Home
          </button>
          <button
            key={"LOGIN"}
            onClick={() => changePage(PageState.LOGIN)}
            className="uppercase text-xl tracking-wide font-semibold hover:underline"
          >
            Login
          </button>
          <button
            key={"ABOUT"}
            onClick={() => changePage(PageState.ABOUT)}
            className="uppercase text-xl tracking-wide font-semibold hover:underline"
          >
            About
          </button>
          <button
            key={"DASHBOARD"}
            onClick={() => changePage(PageState.DASHBOARD)}
            className="uppercase text-xl tracking-wide font-semibold hover:underline"
          >
            My Links
          </button>
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
