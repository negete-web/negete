export function getBaseUrl(): string {
  const raw =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_ENV === "production"
      ? "https://www.negete.pl"
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://www.negete.pl");

  return raw.replace(/\/+$/, "");
}
