"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type NavItem = {
  id: string;
  url: string;
  label: string;
  isCta: boolean;
  newTab: boolean;
};

export function ClientNav({
  mainNav,
  brandName,
  tagline,
}: {
  mainNav: NavItem[];
  brandName: string;
  tagline: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else if (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    // Close mobile nav on route change
    setIsOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <header className="topbar">
      <div className="container nav-shell">
        <Link href="/" className="brand" aria-label={`${brandName} home`}>
          <span className="brand-mark">CET</span>
          <span>
            <strong>{brandName}</strong>
            <small>{tagline}</small>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          {mainNav.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className={item.isCta ? "button button-primary nav-cta" : "nav-link"}
              target={item.newTab ? "_blank" : undefined}
              rel={item.newTab ? "noreferrer" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
            {isDark ? "☀️" : "🌙"}
          </button>
        </nav>

        <div className="mobile-nav-controls">
          <button className="theme-toggle mobile-theme" onClick={toggleTheme} aria-label="Toggle dark mode">
            {isDark ? "☀️" : "🌙"}
          </button>
          <button
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mobile-nav-pane">
          {mainNav.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className={item.isCta ? "button button-primary w-full" : "mobile-nav-link"}
              target={item.newTab ? "_blank" : undefined}
              rel={item.newTab ? "noreferrer" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
