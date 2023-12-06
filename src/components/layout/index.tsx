import { Outlet } from "react-router-dom";
import { Footer } from "../footer";

export function Layout(){
  return (
    <>
      <Outlet/>
      <Footer/>
    </>
  )
}