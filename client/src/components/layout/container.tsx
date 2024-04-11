import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}
function Container({ children, className }: Props) {
  return <div className={cn("mx-auto w-[90%] md:w-3/4", className)}>
    {children}
  </div>;
}

export default Container;
