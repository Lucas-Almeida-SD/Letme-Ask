import { useContext } from "react";
import { MyContext } from "../context/AuthContextProvider";

export function useAuth() {
  return useContext(MyContext);
}