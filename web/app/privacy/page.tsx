// app/privacy/page.tsx
import { LegalPageLayout } from '@/components/LegalPageLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | /thepaymentsnerd',
  description: 'Our privacy policy outlines how we handle data at /thepaymentsnerd.',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p><em>Last updated: June 18, 2025</em></p>
      
      <p>
        This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
      </p>

      {/* --- ADD YOUR FULL PRIVACY POLICY TEXT HERE --- */}
      <p>
        This is placeholder text. You should replace this with your actual Privacy Policy content.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, you can contact us:
      </p>
      <ul>
        <li>By email: your.email@example.com</li>
      </ul>
    </LegalPageLayout>
  );
}