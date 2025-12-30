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
  news: NewsItem[];
  perspective?: string;  // Optional editorial perspective/synthesis
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

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>The Payments Nerd — ${publicationDate}</title>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">

  <!-- Main Table -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 20px 15px;">

        <!-- Content Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px;">

          <!-- Header -->
          <tr>
            <td style="padding: 32px 20px 24px; text-align: center; border-bottom: 3px solid #2563eb;">
              <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px;">
                /thepaymentsnerd
              </h1>
              <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 500;">
                ${formattedDate}
              </p>
            </td>
          </tr>

          <!-- News Items -->
          ${news.map((item, index) => `
            <!-- Story ${index + 1} -->
            <tr>
              <td style="padding: 28px 20px; border-bottom: 1px solid #e2e8f0;">

                <!-- Story Number -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <span style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; letter-spacing: 0.5px;">
                        ${index + 1}
                      </span>
                    </td>
                  </tr>
                </table>

                <!-- Title -->
                <h2 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                  ${item.title}
                </h2>

                <!-- Body -->
                <p style="margin: 0 0 14px; font-size: 17px; color: #334155; line-height: 1.6;">
                  ${item.body}
                </p>

                <!-- Source -->
                <p style="margin: 0; font-size: 14px; color: #64748b;">
                  <span style="color: #94a3b8;">Read more:</span>
                  <a href="${ensureHttps(item.source)}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none; font-weight: 600;">
                    ${getPublicationName(item.source)} →
                  </a>
                </p>

              </td>
            </tr>
          `).join('')}

          ${perspective ? `
          <!-- The Nerd's Perspective -->
          <tr>
            <td style="padding: 28px 20px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                      📊 The Nerd's Perspective
                    </p>
                    <p style="margin: 0; font-size: 17px; color: #1e293b; line-height: 1.6; font-style: italic;">
                      ${perspective}
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
          ` : ''}

          <!-- Did You Know -->
          <tr>
            <td style="padding: 28px 20px; background-color: #fffbeb; border-bottom: 1px solid #fbbf24;">

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="margin: 0 0 10px; font-size: 12px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px;">
                      💡 Did You Know?
                    </p>
                    <p style="margin: 0 0 8px; font-size: 16px; color: #78350f; line-height: 1.5;">
                      ${curiosity.text}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #a16207; font-style: italic;">
                      — ${curiosity.source}
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 20px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">
                © ${new Date().getFullYear()} The Payments Nerd
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                <a href="${unsubscribeUrl}" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a>
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
