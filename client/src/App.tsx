import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/layout/header";
import Container from "./components/layout/container";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Container className="border w-3/5 border-slate-300 rounded-md py-6 mt-10">
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
      </Container>
    </>
  );
}

export default App;
