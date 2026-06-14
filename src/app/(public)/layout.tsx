export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const footerLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/data-deletion", label: "Data Deletion" },
];

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="w-full max-w-7xl mx-auto px-lg flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-sm">
          <Image src="/runner-x.png" alt="Runner_X" width={36} height={36} className="rounded-lg" />
          <span className="font-sans text-xl font-bold text-primary tracking-tight">Runner_X</span>
        </Link>
        <div className="flex items-center gap-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-on-surface-variant hover:text-primary transition-colors hidden sm:block"
            >
              {link.label}
            </Link>
          ))}
          {/* Mobile nav links */}
          {navLinks.map((link) => (
            <Link
              key={`mobile-${link.href}`}
              href={link.href}
              className="text-xs text-on-surface-variant hover:text-primary transition-colors sm:hidden"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-surface-container-lowest">
      <div className="w-full max-w-7xl mx-auto px-lg py-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          <div>
            <div className="flex items-center gap-sm">
              <Image src="/runner-x.png" alt="Runner_X" width={28} height={28} className="rounded-md" />
              <p className="font-sans text-lg font-bold text-primary tracking-tight">Runner_X</p>
            </div>
            <p className="text-xs text-on-surface-variant mt-sm">Campus Hustle, Delivered Fast.</p>
            <p className="text-xs text-on-surface-variant mt-xs">Built for KNUST students 🇬🇭</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-sm">Pages</p>
            <div className="flex flex-col gap-xs">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-on-surface hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-sm">Legal</p>
            <div className="flex flex-col gap-xs">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-on-surface hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-xl pt-lg border-t border-border flex flex-col sm:flex-row justify-between items-center gap-sm">
          <p className="text-xs text-on-surface-variant">© 2025 Runner_X. All rights reserved.</p>
          <p className="text-xs text-on-surface-variant">Kumasi, Ghana</p>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </>
  );
}
