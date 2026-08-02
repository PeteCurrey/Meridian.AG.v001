"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { TerminalShell } from "./TerminalShell";

export function ShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <TerminalShell activePath={pathname}>{children}</TerminalShell>;
}
