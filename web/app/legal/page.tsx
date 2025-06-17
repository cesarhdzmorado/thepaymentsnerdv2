// web/app/legal/page.tsx
import { LegalPageLayout } from '@/components/LegalPageLayout';
import type { Metadata } from 'next';

// This sets the browser tab title for this specific page
export const metadata: Metadata = {
  title: 'Legal Terms | /thepaymentsnerd',
  description: 'The legal terms and conditions for using the /thepaymentsnerd website.',
};

export default function LegalTermsPage() {
  // We'll use today's date dynamically for the 'Last updated' field
  const lastUpdatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <LegalPageLayout title="Legal Terms">
      <p>
        <em>Last updated: {lastUpdatedDate}</em>
      </p>

      <p>
        Please read these terms and conditions carefully before using our website.
      </p>

      <hr />

      <h2>1. Identifying Information</h2>
      <ul>
        <li><strong>Site Owner:</strong> The Payments Nerd</li>
        <li><strong>Domain:</strong> https://www.thepaymentsnerd.co</li>
        <li><strong>Contact Email:</strong> hello@thepaymentsnerd.com</li>
      </ul>

      <h2>2. Purpose</h2>
      <p>
        /thepaymentsnerd is a free newsletter dedicated to summarising the most relevant news in the fintech and payments industry. No products or services are sold directly through this website.
      </p>

      <h2>3. Scope</h2>
      <p>
        This Legal Notice governs the use of the website thepaymentsnerd.co, owned by /thepaymentsnerd. By browsing this website, you agree to be considered a user and fully accept the terms outlined herein.
      </p>

      <h2>4. Terms of Use</h2>
      <p>
        Access to this website is free of charge, except for any connection costs incurred via the telecommunications network provided by your internet service provider.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        All website content—including but not limited to text, images, graphics, icons, design elements, and source code—is the intellectual property of /thepaymentsnerd and may not be reproduced or distributed without explicit permission.
      </p>

      <h2>6. Disclaimer of Liability</h2>
      <p>
        /thepaymentsnerd is not liable for any damages resulting from improper use of this site. Under no circumstances shall /thepaymentsnerd be held responsible for losses or damages arising from access to, browsing of, or use of the website.
      </p>

      <h2>7. Modifications</h2>
      <p>
        /thepaymentsnerd reserves the right to update or modify any aspect of the website, including content, layout, and functionality, without prior notice.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about these Legal Terms, you can contact us via email at{' '}
        <a href="mailto:hello@thepaymentsnerd.com">hello@thepaymentsnerd.com</a>.
      </p>
    </LegalPageLayout>
  );
}