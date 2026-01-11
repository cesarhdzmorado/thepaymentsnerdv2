// web/app/legal/page.tsx
import { LegalPageLayout } from '@/components/LegalPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | /thepaymentsnerd',
  description: 'The terms and conditions governing your use of the /thepaymentsnerd website and newsletter service.',
};

export default function LegalTermsPage() {
  return (
    <LegalPageLayout title="Terms of Use">
      <p>
        <em>Effective Date: January 2026</em>
      </p>
      <hr />

      <p>
        These Terms of Use (&quot;Terms&quot;) govern your access to and use of the /thepaymentsnerd website located at https://www.thepaymentsnerd.co (&quot;Website&quot;) and our email newsletter service (&quot;Service&quot;). By accessing the Website or subscribing to our newsletter, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Website or Service.
      </p>

      <h2>1. About Us</h2>
      <ul>
        <li><strong>Service Provider:</strong> /thepaymentsnerd</li>
        <li><strong>Website:</strong> https://www.thepaymentsnerd.co</li>
        <li><strong>Contact:</strong> <a href="mailto:cesar@thepaymentsnerd.co">cesar@thepaymentsnerd.co</a></li>
      </ul>

      <h2>2. Description of Service</h2>
      <p>
        /thepaymentsnerd provides a free email newsletter service offering curated news, insights, and analysis relating to the fintech and payments industry. The Service includes:
      </p>
      <ul>
        <li>Daily email newsletters containing industry news summaries</li>
        <li>Access to current and archived newsletter content on the Website</li>
        <li>Navigation between historical newsletter editions</li>
      </ul>
      <p>
        The Service is provided free of charge. No products or services are sold directly through this Website.
      </p>

      <h2>3. Eligibility and Registration</h2>
      <p>
        To subscribe to our newsletter, you must provide a valid email address. By subscribing, you confirm that:
      </p>
      <ul>
        <li>You are at least 18 years of age or have the consent of a parent or guardian</li>
        <li>The email address you provide is accurate and belongs to you</li>
        <li>You consent to receive our newsletter communications</li>
      </ul>

      <h2>4. Acceptable Use</h2>
      <p>
        You agree to use the Website and Service only for lawful purposes. You must not:
      </p>
      <ul>
        <li>Use the Service in any way that breaches applicable local, national, or international law or regulation</li>
        <li>Attempt to gain unauthorised access to our systems or networks</li>
        <li>Transmit any material that is defamatory, offensive, or otherwise objectionable</li>
        <li>Use automated systems or software to extract data from the Website without our written permission</li>
        <li>Interfere with or disrupt the integrity or performance of the Website</li>
      </ul>

      <h2>5. Intellectual Property Rights</h2>
      <p>
        All content on this Website—including but not limited to text, graphics, logos, images, design elements, newsletter content, and underlying code—is the intellectual property of /thepaymentsnerd or our licensors and is protected by United Kingdom and international copyright, trademark, and other intellectual property laws.
      </p>
      <p>
        You may view, download, and print content from the Website for your personal, non-commercial use only. You must not:
      </p>
      <ul>
        <li>Republish, reproduce, or redistribute our content without express written permission</li>
        <li>Use our content for commercial purposes without a licence</li>
        <li>Remove any copyright or proprietary notices from any content</li>
      </ul>

      <h2>6. Third-Party Links and Sources</h2>
      <p>
        Our newsletter content may include links to third-party websites and sources. These links are provided for informational purposes only. We do not endorse, control, or assume responsibility for the content, privacy policies, or practices of any third-party websites. Accessing third-party sites is at your own risk.
      </p>

      <h2>7. Disclaimer of Warranties</h2>
      <p>
        The information provided through the Website and Service is for general informational purposes only and does not constitute professional financial, legal, or investment advice. While we endeavour to provide accurate and up-to-date information:
      </p>
      <ul>
        <li>The content is provided &quot;as is&quot; without warranties of any kind, either express or implied</li>
        <li>We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components</li>
        <li>We make no representations regarding the accuracy, completeness, or reliability of any content</li>
      </ul>
      <p>
        You should seek professional advice before making any financial or business decisions based on information from our Service.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law:
      </p>
      <ul>
        <li>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Website or Service</li>
        <li>Our total liability for any claims arising from your use of the Service shall not exceed the amount you have paid to us (which, as a free service, is nil)</li>
        <li>We are not liable for any loss or damage caused by reliance on information contained in the newsletter or on the Website</li>
      </ul>
      <p>
        Nothing in these Terms excludes or limits our liability for: (a) death or personal injury caused by our negligence; (b) fraud or fraudulent misrepresentation; or (c) any other matter which cannot be excluded or limited under applicable law, including your statutory rights under the Consumer Rights Act 2015.
      </p>

      <h2>9. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless /thepaymentsnerd and its operators from any claims, damages, losses, or expenses (including reasonable legal fees) arising from your breach of these Terms or your use of the Website or Service.
      </p>

      <h2>10. Modifications to the Service and Terms</h2>
      <p>
        We reserve the right to:
      </p>
      <ul>
        <li>Modify, suspend, or discontinue any aspect of the Website or Service at any time without prior notice</li>
        <li>Update or amend these Terms at any time; material changes will be communicated via the Website</li>
        <li>Change the content, format, or frequency of the newsletter</li>
      </ul>
      <p>
        Your continued use of the Service after any changes constitutes acceptance of the revised Terms.
      </p>

      <h2>11. Termination</h2>
      <p>
        You may stop using the Service at any time by unsubscribing from the newsletter. We may terminate or suspend your access to the Service immediately, without prior notice, if you breach these Terms or for any other reason at our discretion.
      </p>

      <h2>12. Governing Law and Jurisdiction</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from or relating to these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts of England and Wales.
      </p>
      <p>
        If you are a consumer, you may also bring proceedings in the courts of the country where you reside, and nothing in these Terms affects your statutory rights.
      </p>

      <h2>13. Severability</h2>
      <p>
        If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.
      </p>

      <h2>14. Entire Agreement</h2>
      <p>
        These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and /thepaymentsnerd regarding your use of the Website and Service, and supersede any prior agreements or understandings.
      </p>

      <h2>15. Contact Us</h2>
      <p>
        If you have any questions about these Terms of Use, please contact us at:
      </p>
      <p>
        <a href="mailto:cesar@thepaymentsnerd.co">cesar@thepaymentsnerd.co</a>
      </p>
    </LegalPageLayout>
  );
}
