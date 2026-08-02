import React from "react";
import { TerminalShell } from "../components/TerminalShell.ts";

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
      <body style={{ margin: 0, padding: 0, backgroundColor: "#0a0a0c" }}>
        <TerminalShell activePath="/health">{children}</TerminalShell>
      </body>
    </html>
  );
}
