import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import styles from "./layout.module.css";
import { siteConfig } from "@/config/site";
import ThemeScript from "./components/ThemeScript";
import ThemeToggle from "./components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <Link href="/" className={styles.logo}>
                {siteConfig.name}
              </Link>
              <nav className={styles.nav}>
                <Link href="/" className={styles.navLink}>
                  Home
                </Link>
                <Link href="/pattern-catalog" className={styles.navLink}>
                  Complete Catalog
                </Link>
                <Link href="/obstacles" className={styles.navLink}>
                  Obstacles
                </Link>
                <Link href="/anti-patterns" className={styles.navLink}>
                  Anti-Patterns
                </Link>
                <Link href="/patterns" className={styles.navLink}>
                  Patterns
                </Link>
                <Link href="/talk" className={styles.navLink}>
                  Talk
                </Link>
                <Link href="/contributors" className={styles.navLink}>
                  Contributors
                </Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>

          <main className={styles.main}>
            {children}
          </main>

          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <p>{siteConfig.tagline}</p>
              <ul className={styles.footerLinks}>
                <li>
                  <FooterLink href={siteConfig.links.github}>GitHub</FooterLink>
                </li>
                <li>
                  <FooterLink href={siteConfig.links.contribute}>Contribute</FooterLink>
                </li>
                <li>
                  License: content{" "}
                  <FooterLink href={siteConfig.licenses.content.url} isLicense>
                    {siteConfig.licenses.content.name}
                  </FooterLink>
                  , code{" "}
                  <FooterLink href={siteConfig.licenses.code.url} isLicense>
                    {siteConfig.licenses.code.name}
                  </FooterLink>
                </li>
              </ul>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

function FooterLink({
  href,
  isLicense = false,
  children,
}: Readonly<{
  href: string;
  isLicense?: boolean;
  children: React.ReactNode;
}>) {
  return (
    <a
      href={href}
      className={styles.footerLink}
      target="_blank"
      rel={isLicense ? "license noopener noreferrer" : "noopener noreferrer"}
    >
      {children}
    </a>
  );
}
