// Region mapping for What's Hot section
// Groups countries by geographic region for better scannability

export type Region = "Europe" | "Americas" | "APAC" | "MEA";

export interface RegionInfo {
  name: string;
  emoji: string;
}

export const REGION_INFO: Record<Region, RegionInfo> = {
  Europe: { name: "Europe", emoji: "🇪🇺" },
  Americas: { name: "Americas", emoji: "🌎" },
  APAC: { name: "Asia-Pacific", emoji: "🌏" },
  MEA: { name: "Middle East & Africa", emoji: "🌍" },
};

// Map flag emojis to regions
const FLAG_TO_REGION: Record<string, Region> = {
  // Europe
  "🇬🇧": "Europe",
  "🇩🇪": "Europe",
  "🇫🇷": "Europe",
  "🇳🇱": "Europe",
  "🇸🇪": "Europe",
  "🇮🇪": "Europe",
  "🇨🇿": "Europe",
  "🇪🇪": "Europe",
  "🇱🇹": "Europe",
  "🇪🇸": "Europe",
  "🇮🇹": "Europe",
  "🇨🇭": "Europe",
  "🇵🇱": "Europe",
  "🇧🇪": "Europe",
  "🇦🇹": "Europe",
  "🇩🇰": "Europe",
  "🇫🇮": "Europe",
  "🇳🇴": "Europe",
  "🇵🇹": "Europe",
  "🇬🇷": "Europe",
  // Americas
  "🇺🇸": "Americas",
  "🇨🇦": "Americas",
  "🇧🇷": "Americas",
  "🇦🇷": "Americas",
  "🇲🇽": "Americas",
  "🇨🇴": "Americas",
  "🇨🇱": "Americas",
  "🇵🇪": "Americas",
  // APAC
  "🇸🇬": "APAC",
  "🇮🇳": "APAC",
  "🇦🇺": "APAC",
  "🇯🇵": "APAC",
  "🇨🇳": "APAC",
  "🇭🇰": "APAC",
  "🇮🇩": "APAC",
  "🇰🇷": "APAC",
  "🇹🇼": "APAC",
  "🇹🇭": "APAC",
  "🇻🇳": "APAC",
  "🇵🇭": "APAC",
  "🇲🇾": "APAC",
  "🇳🇿": "APAC",
  // Middle East & Africa
  "🇦🇪": "MEA",
  "🇮🇱": "MEA",
  "🇳🇬": "MEA",
  "🇰🇪": "MEA",
  "🇿🇦": "MEA",
  "🇸🇦": "MEA",
  "🇪🇬": "MEA",
  "🇶🇦": "MEA",
  "🇧🇭": "MEA",
  "🇰🇼": "MEA",
};

export function getRegionForFlag(flag: string): Region {
  return FLAG_TO_REGION[flag] || "Europe"; // Default to Europe if unknown
}

export interface WhatsHotItem {
  flag: string;
  type: "fundraising" | "product" | "M&A" | "expansion";
  company: string;
  description: string;
  source_url?: string;
}

export interface GroupedWhatsHot {
  region: Region;
  info: RegionInfo;
  items: WhatsHotItem[];
}

// Order of regions for display
const REGION_ORDER: Region[] = ["Americas", "Europe", "APAC", "MEA"];

export function groupWhatsHotByRegion(items: WhatsHotItem[]): GroupedWhatsHot[] {
  // Group items by region
  const grouped: Record<Region, WhatsHotItem[]> = {
    Europe: [],
    Americas: [],
    APAC: [],
    MEA: [],
  };

  for (const item of items) {
    const region = getRegionForFlag(item.flag);
    grouped[region].push(item);
  }

  // Return only regions that have items, in the specified order
  return REGION_ORDER
    .filter((region) => grouped[region].length > 0)
    .map((region) => ({
      region,
      info: REGION_INFO[region],
      items: grouped[region],
    }));
}
