export { AdapterRunner } from "./runner";
import { SourceRegistry } from "@meridian/registry";

console.log("[MERIDIAN Engine] Starting engine process...");
const registry = new SourceRegistry();
console.log(`[MERIDIAN Engine] Registered sources count: ${registry.listAll().length}`);
