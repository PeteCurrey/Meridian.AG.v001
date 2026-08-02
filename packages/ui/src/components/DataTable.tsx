"use client";

import React, { useState } from "react";
import { tokens } from "../tokens";

export interface Column<T> {
  readonly key: string;
  readonly header: string;
  readonly render: (row: T) => React.ReactNode;
  readonly sortable?: boolean;
}

export interface DataTableProps<T> {
  readonly data: readonly T[];
  readonly columns: readonly Column<T>[];
  readonly keyExtractor: (row: T) => string;
  readonly emptyMessage?: string;
  readonly isLoading?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "No observations present in current window.",
  isLoading = false
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          padding: tokens.spacing.md,
          fontFamily: tokens.typography.fontFamilySans,
          fontSize: tokens.typography.fontSizeSm,
          color: tokens.colors.textMuted
        }}
      >
        Fetching payload...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        style={{
          padding: tokens.spacing.md,
          fontFamily: tokens.typography.fontFamilySans,
          fontSize: tokens.typography.fontSizeSm,
          color: tokens.colors.textMuted,
          border: `1px dashed ${tokens.colors.borderHairline}`,
          borderRadius: "4px",
          textAlign: "center"
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: tokens.typography.fontFamilySans,
          fontSize: tokens.typography.fontSizeSm,
          textAlign: "left"
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: tokens.colors.panelBg,
              borderBottom: `2px solid ${tokens.colors.borderHairline}`
            }}
          >
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                style={{
                  padding: "12px",
                  color: tokens.colors.textMuted,
                  fontWeight: tokens.typography.fontWeightMedium,
                  textTransform: "uppercase",
                  fontSize: tokens.typography.fontSizeXs,
                  letterSpacing: "0.05em",
                  cursor: col.sortable ? "pointer" : "default",
                  userSelect: "none"
                }}
              >
                {col.header} {sortKey === col.key ? (sortAsc ? "▲" : "▼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr
              key={keyExtractor(row)}
              style={{
                borderBottom: `1px solid ${tokens.colors.borderHairline}`,
                backgroundColor: tokens.colors.bg
              }}
            >
              {columns.map(col => (
                <td key={col.key} style={{ padding: "12px", color: tokens.colors.textPrimary }}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
