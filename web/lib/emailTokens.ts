/* eslint-disable @typescript-eslint/no-explicit-any */

import crypto from "crypto";

type Purpose = "confirm" | "unsubscribe";

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function unbase64url(input: string) {
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  while (input.length % 4) input += "=";
  return Buffer.from(input, "base64").toString("utf8");
}

export function signToken(payload: object, secret: string) {
  const body = base64url(JSON.stringify(payload));
  const sig = base64url(
    crypto.createHmac("sha256", secret).update(body).digest()
  );
  return `${body}.${sig}`;
}

export function verifyToken<T>(token: string, secret: string): T {
  const [body, sig] = token.split(".");
  if (!body || !sig) throw new Error("Malformed token");

  const expected = base64url(
    crypto.createHmac("sha256", secret).update(body).digest()
  );
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    throw new Error("Bad signature");
  }

  const json = JSON.parse(unbase64url(body)) as any;
  if (json.exp && Date.now() > json.exp) throw new Error("Token expired");
  return json as T;
}

export function makeToken(
  email: string,
  purpose: Purpose,
  secret: string,
  expiresInHours: number
) {
  const exp = Date.now() + expiresInHours * 60 * 60 * 1000;
  return signToken(
    { email: email.toLowerCase().trim(), purpose, exp },
    secret
  );
}
