// web/app/legal-terms/page.tsx

export const metadata = {
  title: 'Legal Terms - /thepaymentsnerd',
};

export default function LegalTermsPage() {
  return (
    <div className="bg-slate-900 min-h-screen text-slate-300">
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <article className="prose prose-invert lg:prose-xl">
            <h1>Terms of Service</h1>
            <p className="lead">Last updated: June 15, 2024</p>

            <h2>1. Agreement to Terms</h2>
            {/* CORRECTED: "don't" */}
            <p>By accessing and using /thepaymentsnerd (the "Site"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please don’t use the Site.</p>

            <h2>2. Use of the Site</h2>
            <p>The Site provides curated news summaries and facts for informational purposes only. The content provided is not financial, investment, or legal advice. You agree to use the Site for your personal, non-commercial use only.</p>

            <h2>3. Intellectual Property</h2>
            {/* CORRECTED: "Site's" */}
            <p>The branding, design, and original text of the Site are the property of the Site’s owner. The content summarized is derived from third-party sources, and ownership of the original news content remains with those sources.</p>

            <h2>4. Disclaimer of Warranties</h2>
            <p>The Site is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, regarding the accuracy, reliability, or completeness of the content. Your use of the Site is at your sole risk.</p>

            <h2>5. Limitation of Liability</h2>
            {/* CORRECTED: "Site's" */}
            <p>In no event shall the owner of the Site be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the Site or its content.</p>
            
            <h2>6. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page.</p>

        </article>
      </main>
    </div>
  );
}