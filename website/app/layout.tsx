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
              <p>
                {siteConfig.name} - A guide to effective AI-augmented software development
              </p>
              <div className={styles.footerLinks}>
                <a
                  href={siteConfig.links.github}
                  className={styles.footerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
