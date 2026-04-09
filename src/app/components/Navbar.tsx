"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { t } from "@/i18n/dictionary";
import { LanguageSwitcher } from "./LanguageSwitcher";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [blogCount, setBlogCount] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { lang, getPath } = useLocalizedPath();

  useEffect(() => {
    fetch("/api/blog/count")
      .then((res) => res.json())
      .then((data: { count?: number }) => setBlogCount(data.count ?? 0))
      .catch(() => setBlogCount(0));
  }, []);

  const baseLinks = [
    { name: t(lang, "nav.home"), href: "/", key: "home" },
    { name: t(lang, "nav.projects"), href: "/realizacje", key: "projects" },
    { name: t(lang, "nav.process"), href: "/proces", key: "process" },
    { name: t(lang, "nav.services"), href: "/uslugi", key: "services" },
  ];
  const blogLink = { name: t(lang, "nav.blog"), href: "/blog", key: "blog" };
  const contactLink = {
    name: t(lang, "nav.contact"),
    href: "/kontakt",
    key: "contact",
  };
  const navLinks = [
    ...baseLinks,
    ...(blogCount === null || blogCount > 0 ? [blogLink] : []),
    contactLink,
  ];

  const isActive = (href: string, key: string) => {
    if (key === "home") {
      return pathname === "/" || pathname === `/${lang}`;
    }
    const fullPath = getPath(href);
    return pathname === fullPath || pathname.startsWith(fullPath + "/");
  };

  useEffect(() => {
    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches;
    const nav = navRef.current;
    if (!nav) return;

    if (isMobile) {
      nav.style.opacity = "1";
      nav.style.transform = "translateY(0)";
      return;
    }

    gsap.set(nav, { y: -100, opacity: 0, force3D: true });
    setTimeout(() => {
      if (nav) {
        gsap.to(nav, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          force3D: true,
        });
      }
    }, 300);
  }, []);
  useLayoutEffect(() => {
    if (mobileMenuRef.current) {
      gsap.set(mobileMenuRef.current, { opacity: 0, y: -12 });
    }
  }, []);
  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;

    if (isMobileMenuOpen) {
      gsap.to(menu, {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: "power1.out",
        overwrite: true,
        force3D: true,
      });
    } else {
      gsap.to(menu, {
        opacity: 0,
        y: -12,
        duration: 0.2,
        ease: "power1.in",
        overwrite: true,
        force3D: true,
      });
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t(lang, "common.skipToContent")}
      </a>
      <nav
        ref={navRef}
        className="fixed top-4 max-w-7xl mx-auto left-4 right-4 z-[99999999999] rounded-full md:rounded-full"
        style={{
          background:
            "linear-gradient(to right, rgba(255, 255, 255, 0.15), rgba(0, 0, 0, 0.1))",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-5 py-0.5 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href={getPath("/")} className="flex items-center">
                <Image
                  src="/negete_logo.png"
                  alt="NEGETE Logo"
                  width={120}
                  height={48}
                  className="h-12 w-auto"
                  priority
                />
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const active = isActive(link.href, link.key);
                return (
                  <Link
                    key={link.name}
                    href={getPath(link.href)}
                    className={`transition-colors text-sm font-medium tracking-wide ${
                      active
                        ? "text-[#00f0ff]"
                        : "text-gray-300 hover:text-[#00f0ff]"
                    }`}>
                    {link.name}
                  </Link>
                );
              })}
              <LanguageSwitcher variant="navbar" />
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white"
              aria-expanded={isMobileMenuOpen}
              aria-label={t(
                lang,
                isMobileMenuOpen ? "nav.closeMenu" : "nav.openMenu",
              )}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className="fixed top-[calc(1rem+3.5rem)] left-4 right-4 z-[99999999998] md:hidden"
        style={{ pointerEvents: isMobileMenuOpen ? "auto" : "none" }}>
        <div
          ref={mobileMenuRef}
          aria-hidden={!isMobileMenuOpen}
          className="rounded-2xl overflow-hidden opacity-0 -translate-y-3"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
          }}>
          <nav className="px-4 pt-3 pb-5 space-y-1" aria-label="Menu główne">
            {navLinks.map((link) => {
              const active = isActive(link.href, link.key);
              return (
                <Link
                  key={link.name}
                  href={getPath(link.href)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 px-3 rounded-xl text-sm font-medium tracking-wide transition-colors ${
                    active
                      ? "text-[#00f0ff] bg-cyan-500/10"
                      : "text-gray-300 hover:text-[#00f0ff] hover:bg-white/5"
                  }`}>
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 mt-4 border-t border-white/10">
              <LanguageSwitcher variant="footer" />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
