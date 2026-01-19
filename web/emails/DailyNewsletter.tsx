import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Heading,
  Hr,
} from "@react-email/components";

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

interface DailyNewsletterProps {
  publicationDate: string;
  formattedDate: string;
  perspective?: string;
  news: NewsItem[];
  curiosity: Curiosity;
  unsubscribeUrl: string;
  referralCode: string;
}

export function DailyNewsletter({
  publicationDate,
  formattedDate,
  perspective,
  news,
  curiosity,
  unsubscribeUrl,
  referralCode,
}: DailyNewsletterProps) {
  const heroStory = news[0];
  const quickHits = news.slice(1);

  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>{`
          @media (prefers-color-scheme: dark) {
            .dark-mode { display: block !important; }
            .light-mode { display: none !important; }
          }
          @media (prefers-color-scheme: light) {
            .dark-mode { display: none !important; }
            .light-mode { display: block !important; }
          }
        `}</style>
      </Head>
      <Preview>
        Five critical payments insights. Zero noise. Daily.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logoHeading}>/thepaymentsnerd</Heading>
            <Text style={dateText}>{formattedDate}</Text>
            <Text style={{ margin: "8px 0 0 0" }}>
              <Link href="https://www.thepaymentsnerd.co" style={viewOnlineLink}>
                View Online
              </Link>
            </Text>
          </Section>

          {/* What Matters Today */}
          {perspective && (
            <>
              <Section style={section}>
                <Text style={sectionLabel}>WHAT MATTERS TODAY</Text>
                <Text style={perspectiveText}>{perspective}</Text>
              </Section>
              <Hr style={divider} />
            </>
          )}

          {/* Hero Story */}
          <Section style={section}>
            <Text style={sectionLabel}>TODAY'S LEAD STORY</Text>
            <Heading as="h2" style={heroTitle}>
              {heroStory.title}
            </Heading>
            <Text style={bodyText}>{heroStory.body}</Text>
            <Text style={sourceText}>
              <Link href={heroStory.source.url} style={sourceLink}>
                → {heroStory.source.name}
              </Link>
            </Text>
          </Section>

          {/* Quick Hits */}
          {quickHits.length > 0 && (
            <>
              <Hr style={divider} />
              <Section style={section}>
                <Text style={sectionLabel}>ALSO WORTH KNOWING</Text>
              </Section>
              {quickHits.map((item, index) => (
                <Section key={index} style={quickHitSection}>
                  <Heading as="h3" style={quickHitTitle}>
                    {item.title}
                  </Heading>
                  <Text style={quickHitBody}>{item.body}</Text>
                  <Text style={sourceText}>
                    <Link href={item.source.url} style={sourceLink}>
                      → {item.source.name}
                    </Link>
                  </Text>
                </Section>
              ))}
            </>
          )}

          {/* Did You Know */}
          <Hr style={divider} />
          <Section style={section}>
            <Text style={sectionLabel}>💡 DID YOU KNOW?</Text>
            <Text style={curiosityText}>{curiosity.text}</Text>
            <Text style={curiositySource}>
              —{" "}
              <Link href={curiosity.source.url} style={curiosityLink}>
                {curiosity.source.name}
              </Link>
            </Text>
          </Section>

          {/* Signature */}
          <Hr style={divider} />
          <Section style={signatureSection}>
            <Text style={signatureText}>
              Made with ❤️ for the payments community
            </Text>
            <Text style={signatureAuthor}>
              by <Link href="https://www.linkedin.com/in/cesarhernandezm" style={signatureLink}>Cesar Hernandez</Link>
            </Text>
          </Section>

          {/* Share Section */}
          <Hr style={divider} />
          <Section style={shareSection}>
            <Text style={shareHeading}>
              Share the Nerd's take
            </Text>
            <Text style={shareSubtext}>
              Your payments friends get smarter, you get rewarded. Win-win.
            </Text>
            <Text style={shareIncentive}>
              Share your unique link and unlock exclusive content as you refer more readers.
            </Text>
            <Link href={`https://www.thepaymentsnerd.co?ref=${referralCode}`} style={referralLinkStyle}>
              https://www.thepaymentsnerd.co?ref={referralCode}
            </Link>

            <table
              role="presentation"
              cellSpacing="0"
              cellPadding="0"
              style={{ margin: "24px auto 0", textAlign: "center" as const }}
            >
              <tbody>
                <tr>
                  <td style={{ padding: "0 12px" }}>
                    <Link href={getXShareUrl(referralCode)}>
                      <img src="https://www.thepaymentsnerd.co/images/x-logo.png" alt="Share on X" width="28" height="28" style={{ display: "block" }} />
                    </Link>
                  </td>
                  <td style={{ padding: "0 12px" }}>
                    <Link href={getLinkedInShareUrl(referralCode)}>
                      <img src="https://www.thepaymentsnerd.co/images/linkedin-logo.png" alt="Share on LinkedIn" width="28" height="28" style={{ display: "block" }} />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <Link href="https://www.thepaymentsnerd.co" style={footerLink}>
                www.thepaymentsnerd.co
              </Link>
            </Text>
            <Text style={footerText}>
              <Link href={unsubscribeUrl} style={footerLink}>
                Unsubscribe
              </Link>
            </Text>
            <Text style={footerTagline}>
              Five critical payments insights. Zero noise. Daily.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Helper functions
function getXShareUrl(referralCode: string): string {
  const text = encodeURIComponent(
    "Just discovered /thepaymentsnerd - a daily AI-curated briefing on payments industry news. Worth checking out!"
  );
  const url = encodeURIComponent(`https://www.thepaymentsnerd.co?ref=${referralCode}`);
  return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
}

function getLinkedInShareUrl(referralCode: string): string {
  const url = encodeURIComponent(`https://www.thepaymentsnerd.co?ref=${referralCode}`);
  return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
}

// Styles with dark mode support
const main = {
  backgroundColor: "#fafaf9",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
};

const header = {
  padding: "40px 40px 32px 40px",
};

const logoHeading = {
  margin: "0 0 8px 0",
  fontSize: "26px",
  fontWeight: "700",
  color: "#0a0a0a",
  letterSpacing: "-0.5px",
};

const dateText = {
  margin: "0",
  fontSize: "14px",
  color: "#737373",
  fontWeight: "400",
};

const viewOnlineLink = {
  fontSize: "11px",
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "500",
  whiteSpace: "nowrap" as const,
  display: "inline-block",
  lineHeight: "16px",
};

const section = {
  padding: "0 40px 32px 40px",
};

const signatureSection = {
  padding: "24px 40px 32px 40px",
};

const sectionLabel = {
  margin: "0 0 12px 0",
  fontSize: "11px",
  fontWeight: "700",
  color: "#737373",
  textTransform: "uppercase" as const,
  letterSpacing: "0.8px",
};

const perspectiveText = {
  margin: "0",
  fontSize: "17px",
  color: "#171717",
  lineHeight: "1.7",
  fontWeight: "500",
};

const heroTitle = {
  margin: "0 0 16px 0",
  fontSize: "24px",
  fontWeight: "700",
  color: "#0a0a0a",
  lineHeight: "1.3",
};

const bodyText = {
  margin: "0 0 12px 0",
  fontSize: "17px",
  color: "#404040",
  lineHeight: "1.7",
};

const sourceText = {
  margin: "0",
  fontSize: "15px",
};

const sourceLink = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "500",
};

const quickHitSection = {
  padding: "0 40px 28px 40px",
};

const quickHitTitle = {
  margin: "0 0 8px 0",
  fontSize: "18px",
  fontWeight: "600",
  color: "#171717",
  lineHeight: "1.4",
};

const quickHitBody = {
  margin: "0 0 8px 0",
  fontSize: "16px",
  color: "#525252",
  lineHeight: "1.6",
};

const curiosityText = {
  margin: "0 0 8px 0",
  fontSize: "16px",
  color: "#262626",
  lineHeight: "1.6",
};

const curiositySource = {
  margin: "0",
  fontSize: "14px",
  color: "#737373",
};

const curiosityLink = {
  color: "#737373",
  textDecoration: "none",
  fontStyle: "italic",
};

const divider = {
  borderTop: "1px solid #e5e5e5",
  margin: "0",
};

const signatureText = {
  margin: "0 0 8px 0",
  fontSize: "15px",
  color: "#171717",
  fontWeight: "400",
  textAlign: "center" as const,
};

const signatureAuthor = {
  margin: "0",
  fontSize: "14px",
  color: "#525252",
  textAlign: "center" as const,
};

const signatureLink = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "500",
};

const shareSection = {
  padding: "32px 40px",
  textAlign: "center" as const,
};

const shareHeading = {
  margin: "0 0 12px 0",
  fontSize: "18px",
  color: "#171717",
  fontWeight: "700",
};

const shareSubtext = {
  margin: "0 0 16px 0",
  fontSize: "15px",
  color: "#404040",
  lineHeight: "1.6",
};

const shareIncentive = {
  margin: "0 0 12px 0",
  fontSize: "14px",
  color: "#525252",
  lineHeight: "1.5",
};

const referralLinkStyle = {
  display: "block",
  margin: "0",
  padding: "12px 16px",
  backgroundColor: "#f4f4f5",
  color: "#2563eb",
  textDecoration: "none",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "500",
  border: "1px solid #e5e5e5",
  wordBreak: "break-all" as const,
};

const footer = {
  padding: "32px 40px",
  textAlign: "center" as const,
  borderTop: "1px solid #e5e5e5",
};

const footerText = {
  margin: "0 0 8px 0",
  fontSize: "13px",
  color: "#737373",
};

const footerLink = {
  color: "#737373",
  textDecoration: "none",
};

const footerTagline = {
  margin: "12px 0 0 0",
  fontSize: "12px",
  color: "#a3a3a3",
};

export default DailyNewsletter;
