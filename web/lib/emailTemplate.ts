import { getPublicationName, ensureHttps } from "./publicationNames";

interface NewsItem {
  title: string;
  body: string;
  source: string;
}

interface Curiosity {
  text: string;
  source: string;
}

interface DailyNewsletterParams {
  publicationDate: string;
  intro?: string;  // Optional daily intro - only when there's a real macro insight
  news: NewsItem[];
  perspective?: string;  // Editorial lens/setup - "What Matters Today"
  curiosity: Curiosity;
  unsubscribeUrl: string;
}

/**
 * Generate a compelling subject line from newsletter content
 * Format: "/thepaymentsnerd: Topic1 & Topic2"
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

  // Join with & and create subject with /thepaymentsnerd branding
  const highlight = topics.join(' & ');
  return `/thepaymentsnerd: ${highlight}`;
}

export function generateDailyNewsletterEmail({
  publicationDate,
  intro,
  news,
  perspective,
  curiosity,
  unsubscribeUrl,
}: DailyNewsletterParams): string {
  const formattedDate = new Date(`${publicationDate}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Split news into hero (first) and quick hits (rest)
  const heroStory = news[0];
  const quickHits = news.slice(1);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>/thepaymentsnerd — ${publicationDate}</title>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">

  <!-- Main Container -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fafafa;">
    <tr>
      <td align="center" style="padding: 40px 20px;">

        <!-- Content -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 16px 40px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #0a0a0a; letter-spacing: -0.5px;">
                /thepaymentsnerd
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <p style="margin: 0; font-size: 14px; color: #737373; font-weight: 400;">
                ${formattedDate}
              </p>
            </td>
          </tr>

          ${intro ? `
          <!-- Optional Intro -->
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <p style="margin: 0; font-size: 16px; color: #262626; line-height: 1.6;">
                ${intro}
              </p>
            </td>
          </tr>
          ` : ''}

          ${perspective ? `
          <!-- What Matters Today -->
          <tr>
            <td style="padding: 0 40px 8px 40px;">
              <p style="margin: 0; font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 0.8px;">
                WHAT MATTERS TODAY
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px 40px; border-bottom: 1px solid #e5e5e5;">
              <p style="margin: 0; font-size: 16px; color: #171717; line-height: 1.7; font-weight: 500;">
                ${perspective}
              </p>
            </td>
          </tr>
          ` : ''}

          <!-- Hero Story -->
          <tr>
            <td style="padding: 40px 40px 12px 40px;">
              <p style="margin: 0; font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 0.8px;">
                TODAY'S LEAD STORY
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 16px 40px;">
              <h2 style="margin: 0; font-size: 22px; font-weight: 700; color: #0a0a0a; line-height: 1.3;">
                ${heroStory.title}
              </h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 12px 40px;">
              <p style="margin: 0; font-size: 16px; color: #404040; line-height: 1.7;">
                ${heroStory.body}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <p style="margin: 0; font-size: 15px;">
                <a href="${ensureHttps(heroStory.source)}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none; font-weight: 500;">
                  → ${getPublicationName(heroStory.source)}
                </a>
              </p>
            </td>
          </tr>

          <!-- Quick Hits -->
          ${quickHits.length > 0 ? `
          <tr>
            <td style="padding: 0 40px 20px 40px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; padding-top: 40px; font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 0.8px;">
                ALSO WORTH KNOWING
              </p>
            </td>
          </tr>
          ${quickHits.map((item, index) => `
          <tr>
            <td style="padding: 0 40px ${index === quickHits.length - 1 ? '40px' : '28px'} 40px;">
              <h3 style="margin: 0 0 8px 0; font-size: 17px; font-weight: 600; color: #171717; line-height: 1.4;">
                ${item.title}
              </h3>
              <p style="margin: 0 0 8px 0; font-size: 15px; color: #525252; line-height: 1.6;">
                ${item.body}
              </p>
              <p style="margin: 0; font-size: 14px;">
                <a href="${ensureHttps(item.source)}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none; font-weight: 500;">
                  → ${getPublicationName(item.source)}
                </a>
              </p>
            </td>
          </tr>
          `).join('')}
          ` : ''}

          <!-- Did You Know -->
          <tr>
            <td style="padding: 40px 40px 12px 40px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 0.8px;">
                💡 DID YOU KNOW?
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 8px 40px;">
              <p style="margin: 0; font-size: 15px; color: #262626; line-height: 1.6;">
                ${curiosity.text}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <p style="margin: 0; font-size: 14px; color: #737373;">
                — <a href="${ensureHttps(curiosity.source)}" target="_blank" rel="noopener noreferrer" style="color: #737373; text-decoration: none; font-style: italic;">
                  ${getPublicationName(curiosity.source)}
                </a>
              </p>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding: 40px 40px 40px 40px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; font-size: 15px; color: #171717;">
                — César
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; background-color: #fafafa; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #a3a3a3;">
                <a href="${unsubscribeUrl}" style="color: #a3a3a3; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}
