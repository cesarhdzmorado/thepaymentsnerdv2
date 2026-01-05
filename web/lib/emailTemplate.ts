import { render } from "@react-email/render";
import DailyNewsletter from "@/emails/DailyNewsletter";
import { ensureHttps } from "./publicationNames";

interface Source {
  name: string;
  url: string;
}

interface NewsItem {
  title: string;
  body: string;
  source: Source;
}

interface Curiosity {
  text: string;
  source: Source;
}

interface DailyNewsletterParams {
  publicationDate: string;
  intro?: string;  // Optional daily intro - only when there's a real macro insight
  news: NewsItem[];
  perspective?: string;  // Editorial lens/setup - "What Matters Today"
  curiosity: Curiosity;
  unsubscribeUrl: string;
  referralCode: string;
}

/**
 * Generate a compelling subject line from newsletter content
 * Format: "🤓 /thepaymentsnerd: Topic1 & Topic2"
 */
export function generateEmailSubject(news: NewsItem[]): string {
  // Extract key topics from first 2 news items
  const topics = news.slice(0, 2).map(item => {
    // Extract main topic from title (first few words before details)
    const title = item.title;
    // Try to get the main subject (usually before "Launches", "Announces", "Reports", etc.)
    const match = title.match(/^([^—:]+?)(?:\s+(?:Launches|Announces|Reports|Expects|to|Plans|Debuts))/i);
    if (match) {
      return match[1].trim();
    }
    // Otherwise, take first 5 words
    const words = title.split(' ').slice(0, 5).join(' ');
    return words.length < title.length ? words + '...' : words;
  });

  // Join with & and create subject with /thepaymentsnerd branding and nerd emoji
  const highlight = topics.join(' & ');
  return `🤓 /thepaymentsnerd: ${highlight}`;
}

export async function generateDailyNewsletterEmail({
  publicationDate,
  intro,
  news,
  perspective,
  curiosity,
  unsubscribeUrl,
  referralCode,
}: DailyNewsletterParams): Promise<string> {
  const formattedDate = new Date(`${publicationDate}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Ensure sources have https
  const processedNews = news.map(item => ({
    ...item,
    source: {
      name: item.source.name,
      url: ensureHttps(item.source.url),
    },
  }));

  const processedCuriosity = {
    ...curiosity,
    source: {
      name: curiosity.source.name,
      url: ensureHttps(curiosity.source.url),
    },
  };

  // Render React Email component to HTML string
  const html = await render(
    DailyNewsletter({
      publicationDate,
      formattedDate,
      intro,
      perspective,
      news: processedNews,
      curiosity: processedCuriosity,
      unsubscribeUrl,
      referralCode,
    })
  );

  return html;
}
