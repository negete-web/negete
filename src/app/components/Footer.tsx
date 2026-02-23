"use client";

import { useRef, useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useLocalizedPath } from "@/hooks/useLocalizedPath";
import { fetchFooterData } from "@/sanity/footer";
import { fetchServicesSection } from "@/sanity/services";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { t } from "@/i18n/dictionary";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
};

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { lang, getPath } = useLocalizedPath();
  const [footerData, setFooterData] =
    useState<Awaited<ReturnType<typeof fetchFooterData>>>(null);
  const [servicesData, setServicesData] =
    useState<Awaited<ReturnType<typeof fetchServicesSection>>>(null);
  const [faqItems, setFaqItems] = useState<{ id: number; question: string }[]>([]);

  useEffect(() => {
    fetchFooterData(lang).then((data) => setFooterData(data));
    fetchServicesSection(lang).then((data) => setServicesData(data));
    fetch(`/api/faq?lang=${lang}`)
      .then((res) => res.json())
      .then((data: { items?: { id: number; question: string }[] }) => setFaqItems(data.items ?? []))
      .catch(() => setFaqItems([]));
  }, [lang]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (footerRef.current) {
        gsap.fromTo(
          footerRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            force3D: true,
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 90%",
            },
          },
        );
      }

      sectionsRef.current.forEach((section, index) => {
        if (section) {
          gsap.fromTo(
            section,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: index * 0.1,
              force3D: true,
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top 90%",
              },
            },
          );
        }
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const footerLinks = {
    company: [
      { name: t(lang, "nav.home"), href: getPath("/"), key: "home" },
      {
        name: t(lang, "nav.projects"),
        href: getPath("/realizacje"),
        key: "projects",
      },
      {
        name: t(lang, "nav.process"),
        href: getPath("/proces"),
        key: "process",
      },
      {
        name: t(lang, "nav.services"),
        href: getPath("/uslugi"),
        key: "services",
      },
      { name: t(lang, "nav.blog"), href: getPath("/blog"), key: "blog" },
      { name: t(lang, "nav.faq"), href: getPath("/faq"), key: "faq" },
    ],
    services:
      servicesData?.services && servicesData.services.length > 0
        ? servicesData.services.map((s) => ({
            name: s.title,
            href: s.slug ? getPath(`/uslugi/${s.slug}`) : getPath("/uslugi"),
            key: s.slug || "service",
          }))
        : [
            { name: "Projektowanie PCB", href: getPath("/uslugi"), key: "pcb" },
            { name: "Firmware", href: getPath("/uslugi"), key: "firmware" },
            { name: "Mechanika", href: getPath("/uslugi"), key: "mech" },
            { name: "Prototypowanie", href: getPath("/uslugi"), key: "proto" },
          ],
    legal: [
      {
        name: t(lang, "footer.legal.privacy"),
        href: getPath("/polityka-prywatnosci"),
        key: "privacy",
      },
      {
        name: t(lang, "footer.legal.terms"),
        href: getPath("/regulamin"),
        key: "terms",
      },
      {
        name: t(lang, "footer.legal.cookies"),
        href: getPath("/cookies"),
        key: "cookies",
      },
    ],
  };

  const socialLinks =
    footerData?.socialLinks && footerData.socialLinks.length > 0
      ? footerData.socialLinks.map((s) => ({
          icon: ICON_MAP[s.icon] || Linkedin,
          href: s.url,
          label: s.icon,
        }))
      : [
          { icon: Linkedin, href: "#", label: "LinkedIn" },
          { icon: Github, href: "#", label: "GitHub" },
          { icon: Twitter, href: "#", label: "Twitter" },
        ];

  const contactInfo =
    footerData?.contactItems && footerData.contactItems.length > 0
      ? footerData.contactItems.map((c) => ({
          icon: ICON_MAP[c.icon] || Mail,
          text: c.text,
          href: c.url,
        }))
      : [
          {
            icon: Mail,
            text: "kontakt@negete.pl",
            href: "mailto:kontakt@negete.pl",
          },
          { icon: Phone, text: "+48 123 456 789", href: "tel:+48123456789" },
          { icon: MapPin, text: "Warszawa, Polska", href: "#" },
        ];

  const footerDescription =
    footerData?.description ||
    "Twój zewnętrzny dział R&D. Od pomysłu do seryjnej produkcji. Profesjonalne usługi w dziedzinie elektroniki, mechaniki i oprogramowania.";

  return (
    <footer
      ref={footerRef}
      className="relative border-t border-white/10 bg-gradient-to-b from-transparent to-black/20 backdrop-blur-sm">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-32 sm:w-48 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, #1e3a8a, transparent)",
          boxShadow:
            "0 8px 50px 12px rgba(30,58,138,0.6), 0 20px 80px 24px rgba(30,58,138,0.4)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div
            ref={(el) => {
              sectionsRef.current[0] = el;
            }}
            className="space-y-4">
            <Link href={getPath("/")} className="inline-block">
              <img
                src="/negete_logo.png"
                alt="NEGETE Logo"
                className="h-12 mb-4"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {footerDescription}
            </p>
            <ul className="space-y-2 pt-2">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <li key={index}>
                    <a
                      href={info.href}
                      className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors text-sm group">
                      <Icon className="w-4 h-4 group-hover:text-cyan-400 transition-colors shrink-0" />
                      <span>{info.text}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center gap-4 pt-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-cyan-400/20 hover:border-cyan-400/50 border border-white/10 transition-all duration-300 group">
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          <div
            ref={(el) => {
              sectionsRef.current[1] = el;
            }}
            className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-4">Firma</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div
            ref={(el) => {
              sectionsRef.current[2] = el;
            }}
            className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-4">Usługi</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div
            ref={(el) => {
              sectionsRef.current[3] = el;
            }}
            className="space-y-4">
            <h3 className="text-white font-bold text-lg mb-4">
              {t(lang, "footer.faqDefault")}
            </h3>
            <ul className="space-y-3">
              {faqItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`${getPath("/faq")}#faq-${item.id}`}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm line-clamp-2">
                    {item.question}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-1 text-center sm:text-left">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} NEGETE.{" "}
                {t(lang, "footer.copyright")}.
              </p>
              <p className="text-gray-500 text-sm">
                {t(lang, "footer.madeBy")}{" "}
                <a
                  href="https://craftedweb.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400/80 underline hover:text-cyan-400 transition-colors">
                  craftedweb.pl
                </a>
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <LanguageSwitcher variant="footer" />
              {footerLinks.legal.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-gray-500 hover:text-cyan-400 transition-colors text-sm">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
    </footer>
  );
}
