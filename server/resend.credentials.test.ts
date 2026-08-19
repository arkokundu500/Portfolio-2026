import "dotenv/config";
import { describe, expect, it } from "vitest";

describe("Resend credential", () => {
  it("authenticates against the Resend domains endpoint", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey).toBeTruthy();

    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(10_000),
    });

    expect(response.ok).toBe(true);
  }, 15_000);
});
