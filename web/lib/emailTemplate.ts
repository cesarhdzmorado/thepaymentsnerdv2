/* eslint-disable @typescript-eslint/no-explicit-any */

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
  curiosity: Curiosity;
  unsubscribeUrl: string;
}

export function generateDailyNewsletterEmail({
  publicationDate,
  news,
  curiosity,
  unsubscribeUrl,
}: DailyNewsletterParams): string {
  const formattedDate = new Date(`${publicationDate}T00:00:00`).toLocaleDateString("en-US", {
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
    .button { padding: 12px 32px !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
  <!-- Wrapper Table -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 20px;">

        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

          <!-- Header Section -->
          <tr>
            <td align="center" style="padding: 48px 40px 32px;">
              <!-- Logo -->
              <h1 style="margin: 0 0 16px; font-size: 42px; font-weight: 800; letter-spacing: -0.02em; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                /thepaymentsnerd
              </h1>

              <!-- Tagline -->
              <p style="margin: 0 0 24px; font-size: 18px; color: #64748b; font-weight: 500; line-height: 1.6;">
                Your daily briefing on the world of payments
              </p>

              <!-- Date Badge -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #f1f5f9; border-radius: 999px; padding: 10px 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding-right: 8px; line-height: 0;">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </td>
                        <td style="font-size: 14px; font-weight: 600; color: #0f172a;">
                          ${formattedDate}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent);"></div>
            </td>
          </tr>

          <!-- News Items Section -->
          <tr>
            <td style="padding: 32px 40px;">
              ${news.map((item, index) => `
                <!-- News Item ${index + 1} -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: ${index < news.length - 1 ? '32px' : '0'};">
                  <tr>
                    <td>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <!-- Icon Column -->
                          <td width="60" valign="top" style="padding-right: 16px;">
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                              </svg>
                            </div>
                          </td>

                          <!-- Content Column -->
                          <td valign="top">
                            <!-- Topic Badge -->
                            <div style="display: inline-block; background-color: #eff6ff; color: #1e40af; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 12px; border-radius: 999px; margin-bottom: 12px;">
                              TOPIC #${index + 1}
                            </div>

                            <!-- Title -->
                            <h2 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                              ${item.title}
                            </h2>

                            <!-- Body -->
                            <p style="margin: 0 0 12px; font-size: 16px; color: #334155; line-height: 1.6;">
                              ${item.body}
                            </p>

                            <!-- Source Link -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                              <tr>
                                <td style="padding-right: 6px; line-height: 0;">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                  </svg>
                                </td>
                                <td style="font-size: 14px; color: #64748b; font-weight: 500;">
                                  Source:
                                </td>
                                <td style="padding-left: 4px;">
                                  <a href="https://www.${item.source}" target="_blank" rel="noopener noreferrer" style="font-size: 14px; color: #2563eb; font-weight: 600; text-decoration: none;">
                                    ${item.source}
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  ${index < news.length - 1 ? `
                  <tr>
                    <td style="padding-top: 32px;">
                      <div style="height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent);"></div>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              `).join('')}
            </td>
          </tr>

          <!-- Curiosity Section -->
          <tr>
            <td style="padding: 32px 40px 48px;">
              <!-- Curiosity Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 16px; border: 2px solid #fbbf24;">
                <tr>
                  <td style="padding: 32px 24px; text-align: center;">
                    <!-- Icon & Title -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 20px;">
                      <tr>
                        <td style="padding-right: 12px; line-height: 0;">
                          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <line x1="12" y1="2" x2="12" y2="6"></line>
                              <line x1="12" y1="18" x2="12" y2="22"></line>
                              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                              <line x1="2" y1="12" x2="6" y2="12"></line>
                              <line x1="18" y1="12" x2="22" y2="12"></line>
                              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                            </svg>
                          </div>
                        </td>
                        <td style="line-height: 1;">
                          <h3 style="margin: 0; font-size: 28px; font-weight: 700; color: #92400e;">
                            Did You Know?
                          </h3>
                        </td>
                      </tr>
                    </table>

                    <!-- Curiosity Text -->
                    <p style="margin: 0 0 16px; font-size: 18px; font-style: italic; color: #78350f; line-height: 1.6; font-weight: 500;">
                      "${curiosity.text}"
                    </p>

                    <!-- Source -->
                    <div style="display: inline-block; background-color: #fef3c7; color: #92400e; font-size: 14px; font-weight: 600; padding: 8px 16px; border-radius: 999px; border: 1px solid #fbbf24;">
                      — ${curiosity.source}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-top: 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="margin: 0 0 12px; font-size: 14px; color: #64748b;">
                      © ${new Date().getFullYear()} <span style="font-weight: 600; background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">The Payments Nerd</span>. All rights reserved.
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                      <a href="${unsubscribeUrl}" style="color: #64748b; text-decoration: underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
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
