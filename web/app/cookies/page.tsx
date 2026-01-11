// web/app/cookies/page.tsx
import { LegalPageLayout } from '@/components/LegalPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | /thepaymentsnerd',
  description: 'Information about how we use cookies and similar technologies on the /thepaymentsnerd website.',
};

export default function CookiesPolicyPage() {
  return (
    <LegalPageLayout title="Cookie Policy">
      <p>
        <em>Effective Date: January 2026</em>
      </p>
      <hr />

      <p>
        This Cookie Policy explains how /thepaymentsnerd (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies and similar technologies when you visit our website at https://www.thepaymentsnerd.co. This policy should be read alongside our Privacy Policy, which explains how we handle personal data.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners. Cookies can be &quot;first-party&quot; (set by the website you are visiting) or &quot;third-party&quot; (set by a different domain).
      </p>

      <h2>2. Our Use of Cookies</h2>
      <p>
        We are committed to respecting your privacy. Our website is designed to minimise the use of cookies:
      </p>
      <ul>
        <li><strong>Analytics Cookies:</strong> We do not use analytics or tracking cookies</li>
        <li><strong>Advertising Cookies:</strong> We do not use advertising or marketing cookies</li>
        <li><strong>Social Media Cookies:</strong> We do not embed third-party social media tracking</li>
      </ul>
      <p>
        We only use <strong>strictly necessary cookies</strong> that are essential for the basic operation of the website. These may include:
      </p>
      <ul>
        <li><strong>Security Cookies:</strong> To help protect the website and our users from malicious activity</li>
        <li><strong>Load Balancing:</strong> To distribute traffic across servers and ensure optimal performance</li>
        <li><strong>Session Management:</strong> To maintain the state of your browsing session</li>
      </ul>

      <h2>3. Strictly Necessary Cookies - No Consent Required</h2>
      <p>
        In accordance with the UK Privacy and Electronic Communications Regulations 2003 (PECR) as amended, and guidance from the Information Commissioner&apos;s Office (ICO), strictly necessary cookies are exempt from the requirement to obtain user consent. These cookies are essential for the website to function and cannot be switched off in our systems.
      </p>
      <p>
        Since we only use strictly necessary cookies, we do not display a cookie consent banner. You can set your browser to block these cookies, but some parts of the website may not function properly if you do so.
      </p>

      <h2>4. Types of Cookies by Duration</h2>
      <p>
        Cookies can be classified by how long they remain on your device:
      </p>
      <ul>
        <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser. We may use these for essential session management.</li>
        <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period. Any persistent cookies we use are limited to essential functionality.</li>
      </ul>

      <h2>5. How to Manage Cookies</h2>
      <p>
        You can control and manage cookies through your browser settings. Most browsers allow you to:
      </p>
      <ul>
        <li>View and delete cookies stored on your device</li>
        <li>Block all cookies or only third-party cookies</li>
        <li>Set preferences for specific websites</li>
        <li>Receive alerts when cookies are being set</li>
      </ul>
      <p>
        Please note that blocking essential cookies may affect the functionality of the website. For more information on managing cookies, visit your browser&apos;s help documentation or <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a>.
      </p>

      <h2>6. Third-Party Services</h2>
      <p>
        Our website is hosted on infrastructure that may set essential cookies for security and performance. These cookies are subject to the privacy policies of our hosting providers and are used solely for technical purposes.
      </p>
      <p>
        Our newsletter content may link to third-party websites. We are not responsible for the cookie practices of these external sites. We recommend reviewing their cookie policies when you visit them.
      </p>

      <h2>7. Updates to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.
      </p>

      <h2>8. Your Rights</h2>
      <p>
        Under UK data protection law, you have rights regarding how your data is processed. For information about your rights and how to exercise them, please refer to our Privacy Policy or contact us directly.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have any questions about this Cookie Policy or our use of cookies, please contact us at:
      </p>
      <p>
        <a href="mailto:cesar@thepaymentsnerd.co">cesar@thepaymentsnerd.co</a>
      </p>

      <h2>10. Further Information</h2>
      <p>
        For more information about cookies and your rights under UK law, you can visit:
      </p>
      <ul>
        <li><a href="https://ico.org.uk/for-the-public/online/cookies/" target="_blank" rel="noopener noreferrer">ICO Guide to Cookies</a></li>
        <li><a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">About Cookies</a></li>
      </ul>
    </LegalPageLayout>
  );
}
