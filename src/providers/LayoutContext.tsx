// context/LayoutContext.tsx
import { createContext, useContext } from "react";
import type { LayoutContextType } from "../utils/Type";

export const LayoutContext = createContext<LayoutContextType | null>(null);

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider");
  }
  return context;
};
