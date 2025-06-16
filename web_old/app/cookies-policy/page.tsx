// web/app/cookies-policy/page.tsx

export const metadata = {
  title: 'Cookies Policy - /thepaymentsnerd',
};

export default function CookiesPolicyPage() {
  return (
    <div className="bg-slate-900 min-h-screen text-slate-300">
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <article className="prose prose-invert lg:prose-xl">
          <h1>Cookies Policy</h1>
          <p className="lead">Last updated: June 15, 2024</p>
          
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently and to provide information to the site owners.
          </p>
          
          <h2>How We Use Cookies</h2>
          <p>
            Our website uses cookies for a limited number of purposes:
          </p>
          <ul>
            <li>
              <strong>Vercel Analytics:</strong> Our hosting provider, Vercel, uses cookies to collect anonymous analytics data. This helps us understand how visitors interact with our website, such as which pages are most popular and how long visitors stay on the site. This information helps us improve the user experience.
            </li>
            <li>
              <strong>Functionality:</strong> Some cookies may be essential for the basic operation of the website.
            </li>
          </ul>
          <p>We do not use cookies for advertising or tracking across other websites.</p>
          
          <h2>How to Control Cookies</h2>
          <p>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your web browser. Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version. You can obtain up-to-date information about blocking and deleting cookies via these links:
          </p>
          <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">Firefox</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Edge</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
          </ul>
          
          <h2>Changes to This Cookies Policy</h2>
          <p>
            We may update this Cookies Policy from time to time. We encourage you to review this policy periodically for any changes.
          </p>
        </article>
      </main>
    </div>
  );
}