// app/cookies/page.tsx
import { LegalPageLayout } from '@/components/LegalPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookies Policy | /thepaymentsnerd',
  description: 'Information about our use of cookies on the /thepaymentsnerd website.',
};

export default function CookiesPolicyPage() {
  return (
    <LegalPageLayout title="Cookies Policy">
      <p><em>Last updated: June 18, 2025</em></p>
      
      <p>
        This Cookies Policy explains what cookies are and how we use them. You should read this policy so you can understand what type of cookies we use, or the information we collect using cookies and how that information is used.
      </p>

      {/* --- ADD YOUR FULL COOKIES POLICY TEXT HERE --- */}
      <p>
        This is placeholder text. You should replace this with your actual Cookies Policy content.
      </p>
      
      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Cookies Policy, you can contact us:
      </p>
      <ul>
        <li>By email: your.email@example.com</li>
      </ul>
    </LegalPageLayout>
  );
}