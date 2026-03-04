import { getCachedProjectBySlug, getCachedSiteSettings } from "@/sanity/cache";
import { type Language, languages } from "@/i18n/config";
import { t } from "@/i18n/dictionary";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/app/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/app/components/Footer";
import ProjectGallery from "@/app/components/ProjectGallery";
import ProjectImageGrid from "@/app/components/ProjectImageGrid";
import { buildMetadata } from "@/lib/metadata";

export const revalidate = 3600;

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  if (!languages.includes(lang as Language)) return {};
  const [project, settings] = await Promise.all([
    getCachedProjectBySlug(slug, lang as Language),
    getCachedSiteSettings(lang as Language),
  ]);
  if (!project) return {};
  const heroSection = project.sections?.find(
    (s: any) => s._type === "heroSection",
  );
  const title = heroSection?.title ?? project.title;
  return buildMetadata({
    title,
    description: project.description,
    image: project.image,
    siteName: settings?.siteName,
    lang,
    path: `/${lang}/realizacje/${slug}`,
    seo: project.seo,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const project = await getCachedProjectBySlug(slug, lang as Language);

  if (!project) {
    notFound();
  }
  const heroSection = project.sections?.find(
    (s: any) => s._type === "heroSection",
  );
  const heroImage = heroSection?.backgroundImage;
  const heroTitle = heroSection?.title || project.title;
  const heroSubtitle = heroSection?.subtitle;
  const otherSections =
    project.sections?.filter((s: any) => s._type !== "heroSection") || [];

  return (
    <>
      <main id="main-content" className="min-h-screen overflow-hidden">
        {/* Tło — rozmyte plamy neonowe */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-500/15 blur-[140px]" />
          <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-blue-600/12 blur-[120px]" />
          <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[120px]" />
          <div className="absolute top-1/4 left-1/2 w-[300px] h-[300px] rounded-full bg-teal-500/8 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-indigo-500/8 blur-[110px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-26 sm:pb-24">
          <Link
            href={`/${lang}/realizacje`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-12 group text-sm font-medium">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t(lang as Language, "common.backToProjects")}
          </Link>

          {/* Hero — tytuł + zdjęcie */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start mb-20">
            <header className="flex-1 min-w-0">
              {project.categoryLabel && (
                <Badge
                  variant="outline"
                  className="mb-4 bg-cyan-500/10 border-cyan-500/40 text-cyan-400 text-xs font-medium px-3 py-1">
                  {project.categoryLabel}
                </Badge>
              )}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-tight bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                {heroTitle}
              </h1>
              {(heroSubtitle || project.description) && (
                <p className="mt-5 text-lg text-gray-400 leading-relaxed">
                  {heroSubtitle || project.description}
                </p>
              )}
              {/* Dekoracyjne linie */}
              <div className="mt-8 flex gap-1.5">
                <div className="h-1 w-16 rounded-full bg-cyan-400/70" />
                <div className="h-1 w-8 rounded-full bg-violet-400/50" />
                <div className="h-1 w-4 rounded-full bg-blue-400/40" />
              </div>
            </header>

            {(heroImage || project.image) && (
              <div className="w-full lg:w-[45%] shrink-0 flex items-center justify-center">
                {/* Subtelny glow za zdjęciem */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-cyan-500/10 blur-2xl scale-110" />
                  <Image
                    src={heroImage?.url || project.image}
                    alt={heroImage?.alt || project.imageAlt || project.title}
                    width={800}
                    height={600}
                    priority
                    className="relative max-h-[550px] border border-white/10 object-contain max-w-full w-auto h-auto rounded-2xl"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-16">
            {otherSections.map((section: any, index: number) => {
              if (section._type === "descriptionSection") {
                return (
                  <div key={index} className="relative">
                    {section.content && (
                      <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-line border-l-2 border-cyan-400/50 pl-6 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-r-xl py-2">
                        {section.content}
                      </div>
                    )}
                  </div>
                );
              }

              if (section._type === "gallerySection") {
                return (
                  <div key={index} className="space-y-4">
                    {section.title && (
                      <h2 className="text-xl font-medium bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                        {section.title}
                      </h2>
                    )}
                    <ProjectGallery
                      images={project.gallery || []}
                      description={section.description}
                      gridCols="sm:grid-cols-2 lg:grid-cols-3"
                    />
                  </div>
                );
              }

              if (section._type === "specsSection") {
                return (
                  <section key={index} className="space-y-6">
                    {section.title && (
                      <h2 className="text-xl font-medium bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                        {section.title}
                      </h2>
                    )}
                    {section.specs && section.specs.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-white/5 to-cyan-500/5 overflow-hidden">
                        {section.specs.map((spec: any, specIndex: number) => (
                          <div
                            key={specIndex}
                            className="flex justify-between items-baseline px-5 py-3.5 border-b border-white/5 last:border-0 sm:[&:nth-last-child(2)]:border-0">
                            <span className="text-sm text-gray-400">
                              {spec.label}
                            </span>
                            <span className="text-cyan-300 font-medium">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                );
              }

              if (section._type === "featuresSection") {
                return (
                  <section key={index} className="space-y-6">
                    {section.title && (
                      <h2 className="text-xl font-medium bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                        {section.title}
                      </h2>
                    )}
                    {section.features && section.features.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {section.features.map(
                          (feature: any, featureIndex: number) => (
                            <div
                              key={featureIndex}
                              className="relative rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-blue-500/5 p-6 overflow-hidden">
                              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                              <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full bg-violet-500/10 blur-2xl" />
                              {feature.icon && (
                                <span className="text-2xl mb-3 block">
                                  {feature.icon}
                                </span>
                              )}
                              <h3 className="text-white font-medium mb-2">
                                {feature.title}
                              </h3>
                              {feature.description && (
                                <p className="text-gray-400 text-sm leading-relaxed">
                                  {feature.description}
                                </p>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </section>
                );
              }

              if (section._type === "imageGridSection") {
                return (
                  <ProjectImageGrid
                    key={index}
                    items={section.items || []}
                    title={section.title}
                  />
                );
              }

              return null;
            })}
          </div>

          {(!project.sections || project.sections.length === 0) &&
            project.description && (
              <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-line border-l-2 border-cyan-400/50 pl-6 bg-gradient-to-r from-cyan-500/5 to-transparent rounded-r-xl py-2">
                {project.description}
              </div>
            )}

          <div className="mt-20 pt-12 border-t border-white/5">
            <Link
              href={`/${lang}/realizacje`}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm font-medium group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t(lang as Language, "common.allProjects")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
