import Container from "./container";
import { buttonVariants } from "../ui/button";

function Header() {
  return (
    <header className="w-full py-4 mt-20">
      <Container className="flex justify-between items-center">
        <h1 className="text-4xl uppercase font-bold tracking-wider">
          <span className="text-[#00ADD8] pr-3">Go</span>
          <span className="font-normal">URL Shortener</span>
        </h1>
        <div>
          <a href="/login" className="uppercase text-xl tracking-wide font-semibold hover:underline">
            Login
          </a>
        </div>
      </Container>
    </header>
  );
}

export default Header;
