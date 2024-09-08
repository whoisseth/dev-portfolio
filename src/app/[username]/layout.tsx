import React, { ReactNode } from "react";
import Navbar from "./_components/navbar";

type Props = {};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto w-full  px-4 py-12 sm:px-8">
        {children}
      </div>
    </div>
  );
}
