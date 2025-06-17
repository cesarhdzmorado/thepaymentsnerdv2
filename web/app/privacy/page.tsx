// web/app/privacy/page.tsx
import { LegalPageLayout } from '@/components/LegalPageLayout';
import type { Metadata } from 'next';

// This sets the browser tab title for this specific page
export const metadata: Metadata = {
  title: 'Privacy Policy | /thepaymentsnerd',
  description: 'Our privacy policy outlines how we handle data at /thepaymentsnerd.',
};

export default function PrivacyPolicyPage() {
  const lastUpdatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <LegalPageLayout title="Privacy Policy">
      <p className="mb-6">
        <em>Last updated: {lastUpdatedDate}</em>
      </p>
      <hr className="my-8" />

      {/* --- Each section is manually styled for full control --- */}
      
      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Data Controller</h2>
      <ul className="list-none space-y-2 mb-6">
        <li><strong>Controller:</strong> The Payments Nerd</li>
        <li><strong>Contact:</strong> <a href="mailto:cesar.hernandezm@outlook.com" className="text-blue-600 hover:underline">📩 cesar.hernandezm@outlook.com</a></li>
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. What Data We Collect</h2>
      <p className="mb-6">
        We do not collect personal data through forms or tracking systems.
      </p>
      <p className="mb-6">
        However, our server may automatically log certain technical information when you access the site. This includes:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>IP address</li>
        <li>Date and time of access</li>
        <li>Browser type</li>
        <li>Operating system</li>
      </ul>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Purpose and Legal Basis</h2>
      <p className="mb-6">
        We process this technical information solely to:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-6">
          <li>Ensure the security and proper functioning of the website</li>
          <li>Compile anonymous statistics on site usage</li>
      </ul>
      <p className="mb-6">
        The legal basis for this processing is our legitimate interest (Article 6(1)(f) UK GDPR).
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Data Retention</h2>
      <p className="mb-6">
        Server logs are stored for a maximum of 12 months and are then automatically deleted.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Data Sharing and Processors</h2>
      <p className="mb-6">
        The only third party with access to technical data is our hosting provider, who processes this information under a legally binding data processing agreement compliant with UK GDPR.
      </p>
      <p className="mb-6">
        We do not transfer data internationally.
      </p>

      <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Your Rights</h2>
      <p className="mb-6">
        Under UK data protection law, you have the right to:
      </p>
      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>Access your personal data</li>
        <li>Request rectification or erasure</li>
        <li>Object to processing</li>
        <li>Request data portability</li>
      </ul>
      <p className="mb-6">
        To exercise these rights, contact us at <a href="mailto:cesar.hernandezm@outlook.com" className="text-blue-600 hover:underline">📩 cesar.hernandezm@outlook.com</a>. We will respond within 30 days.
      </p>
    </LegalPageLayout>
  );
}