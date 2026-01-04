// web/app/cookies/page.tsx
import { LegalPageLayout } from '@/components/LegalPageLayout';
import type { Metadata } from 'next';

// This sets the browser tab title for this specific page
export const metadata: Metadata = {
  title: 'Cookies Policy | /thepaymentsnerd',
  description: 'Information about our use of cookies on the /thepaymentsnerd website.',
};

export default function CookiesPolicyPage() {
  const lastUpdatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <LegalPageLayout title="Cookie Policy">
      <p className="mb-6">
        <em>Last updated: {lastUpdatedDate}</em>
      </p>
      <hr className="my-8" />

      {/* --- Each section is now manually styled for full control --- */}
      
      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Use of Cookies</h2>
      <p className="mb-6">
        This website does not use analytics or advertising cookies.
      </p>
      <p className="mb-6">
        Only essential cookies are used—strictly necessary for the basic functioning of the site. These may include functions such as load balancing, language preference, or security features.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Consent Exemption</h2>
      <p className="mb-6">
        In accordance with the UK’s Privacy and Electronic Communications Regulations (PECR), these strictly necessary cookies do not require your prior consent.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Further Information</h2>
      <p className="mb-6">
        If you have any questions about this Cookie Policy or our data handling practices, please contact us at:
      </p>
      <p>
        <a href="mailto:cesar@thepaymentsnerd.co" className="text-blue-600 hover:underline">
          📩 cesar@thepaymentsnerd.co
        </a>
      </p>
      
    </LegalPageLayout>
  );
}