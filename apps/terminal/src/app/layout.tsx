import React from "react";
import { ShellWrapper } from "../components/ShellWrapper";

export const metadata = {
  title: "MERIDIAN Terminal",
  description: "MERIDIAN Single Authenticated Shell"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#f8fafc" }}>
        <ShellWrapper>{children}</ShellWrapper>
      </body>
    </html>
  );
}
