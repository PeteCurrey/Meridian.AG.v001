import React from "react";
import { Value } from "../packages/ui/src/components/Value.ts";

// Attempting to render Value WITHOUT mandatory `source` or `timestamp` prop:
// @ts-expect-error - Property 'source' and 'timestamp' are missing in type but required in ValueProps
const invalidValueElement = <Value value={100} />;
