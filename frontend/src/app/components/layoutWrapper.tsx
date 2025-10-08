"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbarRoutes = ["/","/signin", "/signup", "/forgot-password", "/verify-email"];
  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
}
