import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import styles from "./layout.module.css";
import { siteConfig } from "@/config/site";
import ThemeScript from "./components/ThemeScript";
import SiteNavigation from "./components/SiteNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
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
              <SiteNavigation />
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
