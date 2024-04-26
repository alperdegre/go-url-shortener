import React from "react";
import { AuthProvider } from "./authContext";
import { LangProvider } from "./langContext";

interface Props {
  children: React.ReactNode;
}
function Providers({ children }: Props) {
  return <LangProvider><AuthProvider>{children}</AuthProvider></LangProvider>;
}

export default Providers;
