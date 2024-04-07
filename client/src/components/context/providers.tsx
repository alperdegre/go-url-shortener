import React from "react";
import { PageProvider } from "./pageContext";

interface Props {
  children: React.ReactNode;
}
function Providers({ children }: Props) {
  return <PageProvider>{children}</PageProvider>;
}

export default Providers;
