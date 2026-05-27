import { Navbar } from "components/layout/navbar";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar/>
      {children}
    </>
  );
}
