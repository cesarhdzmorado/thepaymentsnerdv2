// components/Footer.tsx
export function Footer() {
  const footerLinks = [
    { name: 'Legal Terms', href: '/legal' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookies Policy', href: '/cookies' },
  ];

  return (
    <footer className="mt-16 pt-8 border-t-2 border-slate-200 text-slate-500">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm">© {new Date().getFullYear()} /thepaymentsnerd. All rights reserved.</p>
        <div className="flex gap-4">
          {footerLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm hover:text-slate-900 hover:underline">
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}