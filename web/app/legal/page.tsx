// web/app/legal/page.tsx
import { LegalPageLayout } from '@/components/LegalPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal Terms | /thepaymentsnerd',
  description: 'The legal terms and conditions for using the /thepaymentsnerd website.',
};

export default function LegalTermsPage() {
  const lastUpdatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <LegalPageLayout title="Legal Terms">
      <p className="mb-6">
        <em>Last updated: {lastUpdatedDate}</em>
      </p>
      <hr className="my-8" />

      {/* --- Each section is now manually styled for full control --- */}
      
      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Identifying Information</h2>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li><strong>Site Owner:</strong> /thepaymentsnerd</li>
        <li><strong>Domain:</strong> https://www.thepaymentsnerd.co</li>
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. Purpose</h2>
      <p className="mb-6">
        /thepaymentsnerd is a free newsletter dedicated to summarising the most relevant news in the fintech and payments industry. No products or services are sold directly through this website.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Scope</h2>
      <p className="mb-6">
        This Legal Notice governs the use of the website thepaymentsnerd.co, owned by /thepaymentsnerd. By browsing this website, you agree to be considered a user and fully accept the terms outlined herein.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Terms of Use</h2>
      <p className="mb-6">
        Access to this website is free of charge, except for any connection costs incurred via the telecommunications network provided by your internet service provider.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Intellectual Property</h2>
      <p className="mb-6">
        All website content—including but not limited to text, images, graphics, icons, design elements, and source code—is the intellectual property of /thepaymentsnerd and may not be reproduced or distributed without explicit permission.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Disclaimer of Liability</h2>
      <p className="mb-6">
        /thepaymentsnerd is not liable for any damages resulting from improper use of this site. Under no circumstances shall /thepaymentsnerd be held responsible for losses or damages arising from access to, browsing of, or use of the website.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">7. Modifications</h2>
      <p className="mb-6">
        /thepaymentsnerd reserves the right to update or modify any aspect of the website, including content, layout, and functionality, without prior notice.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">Contact Us</h2>
      <p className="mb-6">
        If you have any questions about these Legal Terms, you can contact us via email at{' '}
        <a href="mailto:cesar.hernandezm@outlook.com" className="text-blue-600 hover:underline">📩 cesar.hernandezm@outlook.com</a>.
      </p>
    </LegalPageLayout>
  );
}