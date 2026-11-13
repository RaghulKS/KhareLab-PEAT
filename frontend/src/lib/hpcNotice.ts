import type { Me } from "./types";

/**
 * The one HPC-unavailable line the badge shows.
 *
 * A mismatched or missing endpoint used to fail the Orbit connection with a
 * generic timeout. The badge already means "not on a cluster"; this fills its
 * tooltip with the endpoint that was refused and any registered alternatives.
 * Empty when HPC is connected, or when it was simply never configured, so a
 * normal local-only session does not grow a warning.
 */
export function hpcStatusLabel(
  connected: boolean | undefined,
  me: Pick<Me, "auth" | "hpc_error">,
  notes?: string[],
): string {
  if (connected) return "";
  if (me.auth && me.hpc_error) return me.hpc_error;
  if (me.auth) return "";
  return (notes ?? []).find((line) => line.startsWith("Orbit unavailable")) ?? "";
}
