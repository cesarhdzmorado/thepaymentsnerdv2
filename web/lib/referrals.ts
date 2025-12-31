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

/**
 * Extract referral code from URL query parameter
 */
export function extractReferralCode(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("ref");
  } catch {
    return null;
  }
}

/**
 * Generate referral URL
 */
export function generateReferralUrl(referralCode: string, baseUrl: string): string {
  return `${baseUrl}?ref=${referralCode}`;
}
