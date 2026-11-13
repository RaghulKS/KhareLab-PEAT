import { describe, expect, it } from "vitest";
import { hpcStatusLabel } from "./hpcNotice";

const MISMATCH =
  "Orbit unavailable (Configured HPC endpoint 'amarel3' is not available. " +
  "Registered alternatives: other-cluster. No other endpoint was selected. " +
  "Other PEAT work continues.); HPC tasks will run locally.";

describe("hpcStatusLabel", () => {
  it("says nothing while an endpoint is connected", () => {
    expect(hpcStatusLabel(true, { auth: false, hpc_error: MISMATCH }, [MISMATCH])).toBe("");
  });

  it("shows the server note when logins are off", () => {
    expect(hpcStatusLabel(false, { auth: false }, [MISMATCH])).toBe(MISMATCH);
  });

  it("shows the signed-in user's own error and not the operator note", () => {
    expect(
      hpcStatusLabel(false, { auth: true, hpc_error: "endpoint 'mine' is not available" }, [
        MISMATCH,
      ]),
    ).toBe("endpoint 'mine' is not available");
  });

  it("stays quiet when HPC was never configured", () => {
    expect(hpcStatusLabel(false, { auth: false }, ["No ANTHROPIC_API_KEY"])).toBe("");
    expect(hpcStatusLabel(false, { auth: true }, [MISMATCH])).toBe("");
  });
});
