import { sanityClient } from "./client";
import { localized } from "./i18n";
import { type Language } from "@/i18n/config";

export interface ContactPerson {
  name: string;
  role?: string;
  email?: string;
  bio?: string;
}

export interface ContactSection {
  heading: string;
  subtitle?: string;
  people: ContactPerson[];
  nameLabel: string;
  companyLabel: string;
  messageLabel: string;
  submitButton: string;
  successMessage: string;
  errorMessage: string;
  requiredError: string;
  invalidEmail: string;
}

export async function fetchContactSection(
  lang: Language = "pl"
): Promise<ContactSection | null> {
  const query = `
    *[_type == "contactSection"][0]{
      headingPl,
      headingEn,
      subtitlePl,
      subtitleEn,
      people[]{
        namePl,
        nameEn,
        rolePl,
        roleEn,
        email,
        bioPl,
        bioEn
      },
      nameLabelPl,
      nameLabelEn,
      companyLabelPl,
      companyLabelEn,
      messageLabelPl,
      messageLabelEn,
      submitButtonPl,
      submitButtonEn,
      successMessagePl,
      successMessageEn,
      errorMessagePl,
      errorMessageEn,
      requiredErrorPl,
      requiredErrorEn,
      invalidEmailPl,
      invalidEmailEn
    }
  `;

  const data = await sanityClient.fetch<Record<string, unknown> | null>(query);
  if (!data) return null;

  const l = (field: string) => localized(data, field, lang);

  const people: ContactPerson[] = ((data.people as Record<string, unknown>[]) || []).map((p) => ({
    name: localized(p, "name", lang),
    role: localized(p, "role", lang) || undefined,
    email: p.email as string | undefined,
    bio: localized(p, "bio", lang) || undefined,
  }));

  return {
    heading: l("heading") || "Kontakt",
    subtitle: localized(data, "subtitle", lang) || undefined,
    people,
    nameLabel: l("nameLabel") || "Imię",
    companyLabel: l("companyLabel") || "Nazwa firmy",
    messageLabel: l("messageLabel") || "",
    submitButton: l("submitButton") || "Wyślij wiadomość",
    successMessage:
      l("successMessage") ||
      "Dziękujemy! Twoja wiadomość została wysłana. Skontaktujemy się z Tobą wkrótce.",
    errorMessage:
      l("errorMessage") ||
      "Wystąpił błąd. Spróbuj ponownie lub skontaktuj się bezpośrednio przez email.",
    requiredError: l("requiredError") || "To pole jest wymagane",
    invalidEmail: l("invalidEmail") || "Podaj prawidłowy adres email",
  };
}
