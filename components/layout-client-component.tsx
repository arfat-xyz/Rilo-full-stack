"use clinet";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import NavBar from "./nav";

const LayoutclientComponet = ({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) => {
  return (
    <SessionProvider session={session}>
      <NavBar />
      {children}
    </SessionProvider>
  );
};

export default LayoutclientComponet;
