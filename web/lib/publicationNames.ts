/**
 * Extract publication name from a URL
 * Examples:
 *   https://www.pymnts.com/article -> "PYMNTS"
 *   https://techcrunch.com/article -> "TechCrunch"
 *   https://www.finextra.com/article -> "Finextra"
 */
export function getPublicationName(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');

    // Map of domains to clean publication names
    const nameMap: Record<string, string> = {
      'pymnts.com': 'PYMNTS',
      'finextra.com': 'Finextra',
      'techcrunch.com': 'TechCrunch',
      'bankingdive.com': 'Banking Dive',
      'paymentsdive.com': 'Payments Dive',
      'theblock.co': 'The Block',
      'ft.com': 'Financial Times',
      'coindesk.com': 'CoinDesk',
    };

    // Check if we have a mapped name
    if (nameMap[hostname]) {
      return nameMap[hostname];
    }

    // Otherwise, capitalize the domain name
    const domainName = hostname.split('.')[0];
    return domainName.charAt(0).toUpperCase() + domainName.slice(1);
  } catch {
    // If URL parsing fails, return the original string
    return url;
  }
}

/**
 * Ensure URL has proper protocol
 */
export function ensureHttps(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
}
