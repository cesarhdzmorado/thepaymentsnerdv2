import { customAlphabet } from "nanoid";

/**
 * Generate a unique referral code
 * Format: 8 characters, alphanumeric, URL-safe
 * Example: "AB12CD34"
 */
export function generateReferralCode(): string {
  const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);
  return nanoid();
}
