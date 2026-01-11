// web/app/privacy/page.tsx
import { LegalPageLayout } from '@/components/LegalPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | /thepaymentsnerd',
  description: 'Our privacy policy outlines how we handle your personal data at /thepaymentsnerd in compliance with UK data protection law.',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p>
        <em>Effective Date: January 2026</em>
      </p>
      <hr />

      <p>
        This Privacy Policy explains how /thepaymentsnerd (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and protects your personal data when you use our website and subscribe to our newsletter. We are committed to protecting your privacy in accordance with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and all applicable UK data protection legislation.
      </p>

      <h2>1. Data Controller</h2>
      <ul>
        <li><strong>Controller:</strong> /thepaymentsnerd</li>
        <li><strong>Website:</strong> https://www.thepaymentsnerd.co</li>
        <li><strong>Contact:</strong> <a href="mailto:cesar@thepaymentsnerd.co">cesar@thepaymentsnerd.co</a></li>
      </ul>
      <p>
        As the data controller, we determine the purposes and means of processing your personal data and are responsible for ensuring compliance with data protection law.
      </p>

      <h2>2. Personal Data We Collect</h2>
      <p>
        We collect and process the following categories of personal data:
      </p>
      <ul>
        <li><strong>Email Address:</strong> When you subscribe to our newsletter, we collect your email address to deliver our fintech and payments industry insights directly to your inbox.</li>
        <li><strong>Technical Data:</strong> Our servers automatically log certain technical information when you access the site, including IP address, date and time of access, browser type, device type, and operating system.</li>
        <li><strong>Usage Data:</strong> We may collect anonymised data about how you interact with our website to improve our service.</li>
      </ul>

      <h2>3. Legal Basis for Processing</h2>
      <p>
        We process your personal data on the following lawful bases under Article 6 of the UK GDPR:
      </p>
      <ul>
        <li><strong>Consent (Article 6(1)(a)):</strong> When you subscribe to our newsletter, you provide explicit consent for us to send you email communications. You may withdraw this consent at any time by unsubscribing.</li>
        <li><strong>Legitimate Interests (Article 6(1)(f)):</strong> We process technical data to ensure the security, integrity, and proper functioning of our website, and to protect against malicious activity. We have assessed that this processing does not override your fundamental rights and freedoms.</li>
      </ul>

      <h2>4. How We Use Your Data</h2>
      <p>
        We use your personal data for the following purposes:
      </p>
      <ul>
        <li>To deliver our daily newsletter containing curated fintech and payments industry news</li>
        <li>To maintain and improve the security and functionality of our website</li>
        <li>To compile anonymised usage statistics</li>
        <li>To respond to enquiries you may send us</li>
        <li>To comply with legal obligations</li>
      </ul>

      <h2>5. Data Processors and Third Parties</h2>
      <p>
        We work with the following categories of third-party data processors who process data on our behalf:
      </p>
      <ul>
        <li><strong>Database Provider (Supabase):</strong> We use Supabase to securely store subscriber email addresses and newsletter content. Supabase operates under a Data Processing Agreement compliant with UK GDPR requirements.</li>
        <li><strong>Hosting Provider:</strong> Our website is hosted by a provider that processes technical log data under a data processing agreement.</li>
      </ul>
      <p>
        We ensure all processors provide sufficient guarantees regarding data protection and only process data in accordance with our documented instructions.
      </p>

      <h2>6. International Data Transfers</h2>
      <p>
        Some of our data processors may be located outside the United Kingdom. Where personal data is transferred internationally, we ensure appropriate safeguards are in place, including:
      </p>
      <ul>
        <li>Transfers to countries with UK adequacy decisions</li>
        <li>Standard Contractual Clauses (UK International Data Transfer Agreement where applicable)</li>
        <li>Additional technical and organisational measures to protect your data</li>
      </ul>

      <h2>7. Data Retention</h2>
      <p>
        We retain personal data only for as long as necessary to fulfil the purposes for which it was collected:
      </p>
      <ul>
        <li><strong>Newsletter Subscribers:</strong> Your email address is retained until you unsubscribe or request deletion</li>
        <li><strong>Technical Logs:</strong> Server logs are retained for a maximum of 12 months for security purposes and then automatically deleted</li>
      </ul>

      <h2>8. Your Rights Under UK Data Protection Law</h2>
      <p>
        Under the UK GDPR and Data Protection Act 2018, you have the following rights:
      </p>
      <ul>
        <li><strong>Right of Access:</strong> Request a copy of the personal data we hold about you</li>
        <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data</li>
        <li><strong>Right to Erasure:</strong> Request deletion of your personal data in certain circumstances</li>
        <li><strong>Right to Restrict Processing:</strong> Request limitation of how we use your data</li>
        <li><strong>Right to Data Portability:</strong> Receive your data in a structured, commonly used format</li>
        <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
        <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent (this does not affect the lawfulness of processing before withdrawal)</li>
      </ul>
      <p>
        To exercise any of these rights, please contact us at <a href="mailto:cesar@thepaymentsnerd.co">cesar@thepaymentsnerd.co</a>. We will respond to your request within one month, as required by law.
      </p>

      <h2>9. Unsubscribing from the Newsletter</h2>
      <p>
        You can unsubscribe from our newsletter at any time by clicking the unsubscribe link included in every email we send, or by contacting us directly. Upon unsubscription, we will cease sending marketing communications and delete your email address from our active mailing list.
      </p>

      <h2>10. Data Security</h2>
      <p>
        We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. These measures include encryption in transit (TLS/SSL), access controls, and regular security assessments.
      </p>

      <h2>11. Your Right to Complain</h2>
      <p>
        If you are not satisfied with how we handle your personal data, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO), the UK&apos;s supervisory authority for data protection:
      </p>
      <ul>
        <li><strong>Website:</strong> <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">https://ico.org.uk</a></li>
        <li><strong>Telephone:</strong> 0303 123 1113</li>
      </ul>

      <h2>12. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any material changes will be communicated via our website. We encourage you to review this policy periodically.
      </p>

      <h2>13. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or wish to exercise your data protection rights, please contact us at:
      </p>
      <p>
        <a href="mailto:cesar@thepaymentsnerd.co">cesar@thepaymentsnerd.co</a>
      </p>
    </LegalPageLayout>
  );
}
