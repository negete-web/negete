import type { Language } from "@/i18n/config";

/**
 * Returns the localized value from a bilingual Sanity document.
 * Falls back to Polish if the requested language field is empty.
 */
export function localized<T extends Record<string, unknown>>(
  data: T,
  field: string,
  lang: Language,
): string {
  const plKey = `${field}Pl` as keyof T;
  const enKey = `${field}En` as keyof T;
  const value = lang === "en" ? data[enKey] : data[plKey];
  return (value as string) || (data[plKey] as string) || "";
}
