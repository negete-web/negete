"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, User, Building, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { fetchContactSection, type ContactSection } from "@/sanity/contact";
import { fetchFooterData } from "@/sanity/footer";
import { languages, type Language } from "@/i18n/config";
import { t } from "@/i18n/dictionary";
import { usePathname } from "next/navigation";
import type { FooterContactItem } from "@/sanity/footer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FALLBACK: ContactSection = {
  heading: "Kontakt",
  subtitle: "Skontaktuj się z nami i zbudujmy coś razem",
  people: [
    {
      name: "Bartłomiej Zachara",
      role: "Founder & Lead Engineer",
      email: "b.zachara@negete.pl",
      bio: "Z pasją projektuję i tworzę zaawansowane urządzenia elektroniczne. Specjalizuję się w kompleksowym rozwoju produktów - od koncepcji, przez projekt PCB, oprogramowanie embedded, aż po druk 3D obudów.",
    },
  ],
  nameLabel: "Imię",
  companyLabel: "Nazwa firmy",
  messageLabel: "Opisz krótko jaki produkt chcesz z nami zbudować?",
  submitButton: "Wyślij wiadomość",
  successMessage:
    "Dziękujemy! Twoja wiadomość została wysłana. Skontaktujemy się z Tobą wkrótce.",
  errorMessage:
    "Wystąpił błąd. Spróbuj ponownie lub skontaktuj się bezpośrednio przez email.",
  requiredError: "To pole jest wymagane",
  invalidEmail: "Podaj prawidłowy adres email",
};

interface ContactProps {
  lang?: Language;
  initialData?: ContactSection | null;
  /** Dane kontaktowe (mail, tel) do wyświetlenia po prawej – z footerContactItems */
  contactItems?: FooterContactItem[] | null;
  /** Na stronie /kontakt użyj H1 zamiast H2 */
  headingLevel?: "h1" | "h2";
}

export default function Contact({
  lang: langProp,
  initialData: initialDataProp,
  contactItems: contactItemsProp,
  headingLevel = "h2",
}: ContactProps) {
  const pathname = usePathname();
  const [contactData, setContactData] = useState<ContactSection | null>(
    initialDataProp ?? null,
  );
  const [contactItems, setContactItems] = useState<FooterContactItem[] | null>(
    contactItemsProp ?? null,
  );
  const [formData, setFormData] = useState({
    firstName: "",
    companyName: "",
    email: "",
    productDescription: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    email?: string;
    productDescription?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const clearFieldError = (field: keyof typeof fieldErrors) => {
    setFieldErrors((p) => {
      const next = { ...p };
      delete next[field];
      return next;
    });
  };

  const getLang = (): Language => {
    if (langProp) return langProp;
    const segments = pathname?.split("/").filter(Boolean);
    if (segments.length > 0 && languages.includes(segments[0] as Language)) {
      return segments[0] as Language;
    }
    return "pl";
  };

  const lang = getLang();

  useEffect(() => {
    if (initialDataProp) return;
    fetchContactSection(lang)
      .then((data) => data && setContactData(data))
      .catch((err) => console.error("Błąd pobierania sekcji kontakt:", err));
  }, [lang, initialDataProp]);

  useEffect(() => {
    if (contactItemsProp) return;
    fetchFooterData(lang)
      .then((data) => data?.contactItems && setContactItems(data.contactItems))
      .catch((err) => console.error("Błąd pobierania stopki:", err));
  }, [lang, contactItemsProp]);

  const data = contactData || FALLBACK;

  const mailItem = contactItems?.find((i) => i.icon === "Mail");
  const phoneItem = contactItems?.find((i) => i.icon === "Phone");

  return (
    <section
      data-section="contact"
      className="relative py-24 px-6 bg-gradient-to-b from-transparent via-white/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12">
          {headingLevel === "h1" ? (
            <h1 className="text-3xl sm:text-4xl font-medium text-white mb-4">
              {data.heading}
            </h1>
          ) : (
            <h2 className="text-3xl sm:text-4xl font-medium text-white mb-4">
              {data.heading}
            </h2>
          )}
          {data.subtitle && (
            <p className="text-gray-400 text-lg">{data.subtitle}</p>
          )}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-stretch lg:items-start justify-center">
          {data.people.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full lg:max-w-sm shrink-0 flex flex-col gap-4">
              <h3 className="text-xl font-medium text-white mb-1">
                {t(lang, "about.title")}
              </h3>
              {data.people.map((person, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="rounded-xl border-2 border-cyan-400/50 bg-white/5 shadow-lg shadow-cyan-500/10 p-5">
                  <h4 className="font-bold text-white text-base">
                    {person.name}
                  </h4>
                  {person.role && (
                    <p className="text-cyan-400 text-sm mt-1">{person.role}</p>
                  )}
                  {person.email && (
                    <a
                      href={`mailto:${person.email}`}
                      className="text-gray-400 hover:text-cyan-400 text-sm mt-2 inline-flex items-center gap-1.5 transition-colors">
                      <Mail className="w-4 h-4 shrink-0" />
                      {person.email}
                    </a>
                  )}
                  {person.bio && (
                    <p className="text-gray-400 text-sm leading-relaxed mt-4">
                      {person.bio}
                    </p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md shrink-0 flex flex-col gap-6">
            <form
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitStatus("idle");
                const errors: typeof fieldErrors = {};
                if (!formData.firstName.trim()) {
                  errors.firstName = data.requiredError;
                }
                if (!formData.email.trim()) {
                  errors.email = data.requiredError;
                } else if (!EMAIL_REGEX.test(formData.email)) {
                  errors.email = data.invalidEmail;
                }
                if (!formData.productDescription.trim()) {
                  errors.productDescription = data.requiredError;
                }
                setFieldErrors(errors);
                if (Object.keys(errors).length > 0) return;
                setIsSubmitting(true);
                fetch("https://formspree.io/f/xpqjvyke", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: formData.firstName,
                    company: formData.companyName,
                    email: formData.email,
                    message: formData.productDescription,
                  }),
                })
                  .then((res) => {
                    setIsSubmitting(false);
                    if (res.ok) {
                      setSubmitStatus("success");
                      setFormData({
                        firstName: "",
                        companyName: "",
                        email: "",
                        productDescription: "",
                      });
                      setFieldErrors({});
                    } else {
                      setSubmitStatus("error");
                    }
                  })
                  .catch(() => {
                    setIsSubmitting(false);
                    setSubmitStatus("error");
                  });
              }}>
              <div>
                <label
                  htmlFor="firstName"
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4" />
                  {data.nameLabel} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, firstName: e.target.value }));
                    clearFieldError("firstName");
                  }}
                  required
                  aria-required="true"
                  aria-invalid={!!fieldErrors.firstName}
                  aria-describedby={
                    fieldErrors.firstName ? "firstName-error" : undefined
                  }
                  className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 ${
                    fieldErrors.firstName
                      ? "border-red-400/50"
                      : "border-white/10 focus:border-cyan-400/50"
                  }`}
                  placeholder="Jan"
                />
                {fieldErrors.firstName && (
                  <p
                    id="firstName-error"
                    className="mt-2 text-sm text-red-400"
                    role="alert">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="companyName"
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Building className="w-4 h-4" />
                  {data.companyLabel}
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, companyName: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  placeholder="Twoja firma"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-4 h-4" />
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, email: e.target.value }));
                    clearFieldError("email");
                  }}
                  required
                  aria-required="true"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={
                    fieldErrors.email ? "email-error" : undefined
                  }
                  className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 ${
                    fieldErrors.email
                      ? "border-red-400/50"
                      : "border-white/10 focus:border-cyan-400/50"
                  }`}
                  placeholder="jan@example.com"
                />
                {fieldErrors.email && (
                  <p
                    id="email-error"
                    className="mt-2 text-sm text-red-400"
                    role="alert">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="productDescription"
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  {data.messageLabel} <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="productDescription"
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={(e) => {
                    setFormData((p) => ({
                      ...p,
                      productDescription: e.target.value,
                    }));
                    clearFieldError("productDescription");
                  }}
                  required
                  aria-required="true"
                  aria-invalid={!!fieldErrors.productDescription}
                  aria-describedby={
                    fieldErrors.productDescription
                      ? "productDescription-error"
                      : undefined
                  }
                  rows={6}
                  className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none ${
                    fieldErrors.productDescription
                      ? "border-red-400/50"
                      : "border-white/10 focus:border-cyan-400/50"
                  }`}
                  placeholder="Opisz swoją wizję produktu..."
                />
                {fieldErrors.productDescription && (
                  <p
                    id="productDescription-error"
                    className="mt-2 text-sm text-red-400"
                    role="alert">
                    {fieldErrors.productDescription}
                  </p>
                )}
              </div>

              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-500/20 border border-green-400/50 rounded-lg text-green-400 text-sm">
                  {data.successMessage}
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/20 border border-red-400/50 rounded-lg text-red-400 text-sm">
                  {data.errorMessage}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                variant="cta"
                size="lg"
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed group">
                {isSubmitting ? (
                  t(lang, "contact.sending")
                ) : (
                  <>
                    {data.submitButton}
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </Button>
            </form>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              {mailItem && (
                <a
                  href={
                    mailItem.url?.startsWith("mailto:")
                      ? mailItem.url
                      : `mailto:${mailItem.url || mailItem.text}`
                  }
                  className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center shrink-0 group-hover:border-cyan-400/40 transition-colors">
                    <Mail className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 mb-0.5">
                      {t(lang, "contact.email")}
                    </p>
                    <p className="font-medium truncate">{mailItem.text}</p>
                  </div>
                </a>
              )}
              {phoneItem && (
                <a
                  href={
                    phoneItem.url?.startsWith("tel:")
                      ? phoneItem.url
                      : `tel:${phoneItem.url || phoneItem.text}`
                  }
                  className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center shrink-0 group-hover:border-cyan-400/40 transition-colors">
                    <Phone className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 mb-0.5">
                      {t(lang, "contact.phone")}
                    </p>
                    <p className="font-medium truncate">{phoneItem.text}</p>
                  </div>
                </a>
              )}
              {!mailItem && !phoneItem && (
                <p className="text-gray-500 text-sm">
                  {t(lang, "contact.noContactInfo")}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
