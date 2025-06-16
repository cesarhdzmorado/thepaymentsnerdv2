// web/app/privacy-policy/page.tsx

export const metadata = {
  title: 'Privacy Policy - /thepaymentsnerd',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-900 min-h-screen text-slate-300">
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <article className="prose prose-invert lg:prose-xl">
          <h1>Privacy Policy</h1>
          <p className="lead">Last updated: June 15, 2024</p>
          
          <p>
            Welcome to /thepaymentsnerd. This Privacy Policy explains how we handle information in connection with your use of our website. Your privacy is important to us, and we are committed to protecting it.
          </p>
          
          <h2>Information We Collect</h2>
          <p>
            As a simple, informational website without user accounts or input forms, we do not actively collect any personal information from you such as your name, email address, or phone number.
          </p>
          <p>
            Our web host, Vercel, may collect standard, non-personally identifiable information for analytics and security purposes. This may include:
          </p>
          <ul>
            {/* CORRECTED: "device's" */}
            <li>Your device’s IP address</li>
            <li>Browser type and version</li>
            <li>The pages you visit on our site</li>
            <li>The time and date of your visit</li>
          </ul>
          <p>
            This data is used in an aggregated form to help us understand website traffic and improve our service.
          </p>
          
          <h2>Use of Cookies</h2>
          <p>
            We use a minimal number of cookies to ensure the functionality of our website and to gather analytics data. For more detailed information, please see our <a href="/cookies-policy">Cookies Policy</a>.
          </p>
          
          <h2>Third-Party Links</h2>
          <p>
            {/* CORRECTED: "third party's" */}
            Our website may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party’s site. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>
          
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, you can contact the project owner through the GitHub repository.
          </p>
        </article>
      </main>
    </div>
  );
}