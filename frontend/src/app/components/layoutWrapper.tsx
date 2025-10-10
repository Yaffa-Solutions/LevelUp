"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) =>{
  const pathname = usePathname();
  const hideNavbarRoutes = ["/","/signin", "/signup", "/forgot-password", "/verify-email", "create-profile"];
  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
}

export default LayoutWrapper;