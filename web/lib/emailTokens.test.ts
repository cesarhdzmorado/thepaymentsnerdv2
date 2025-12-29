import { describe, expect, it } from "vitest";

import { makeToken, verifyToken } from "./emailTokens";

describe("email tokens", () => {
  const secret = "super-secret-key";

  it("accepts a token created by makeToken", () => {
    const token = makeToken("user@example.com", "confirm", secret, 1);
    const payload = verifyToken<{ email: string; purpose: string }>(
      token,
      secret
    );

    expect(payload.email).toBe("user@example.com");
    expect(payload.purpose).toBe("confirm");
  });

  it("rejects tampered signatures", () => {
    const token = makeToken("user@example.com", "unsubscribe", secret, 1);
    const tampered = `${token.slice(0, -1)}${
      token.slice(-1) === "a" ? "b" : "a"
    }`;

    expect(() => verifyToken(tampered, secret)).toThrowError("Bad signature");
  });

  it("throws when the token has expired", () => {
    const token = makeToken("user@example.com", "confirm", secret, -1);

    expect(() => verifyToken(token, secret)).toThrowError("Token expired");
  });

  it("throws on malformed token structure", () => {
    expect(() => verifyToken("just-one-part", secret)).toThrowError(
      "Malformed token"
    );
    expect(() => verifyToken(".sig", secret)).toThrowError("Malformed token");
    expect(() => verifyToken("body.", secret)).toThrowError("Malformed token");
  });
});
