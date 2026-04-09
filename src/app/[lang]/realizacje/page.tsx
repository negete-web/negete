import { getCachedAllProjects, getCachedSiteSettings } from "@/sanity/cache";
import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/app/components/ui/badge";
import Footer from "../../components/Footer";
import { buildMetadata } from "@/lib/metadata";
import { t } from "@/i18n/dictionary";

export const revalidate = 3600;

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!languages.includes(lang as Language)) return {};
  const settings = await getCachedSiteSettings(lang as Language);
  const seo = settings?.realizacjeListPageSeo;
  return buildMetadata({
    title: t(lang as Language, "realizacje.title"),
    description: t(lang as Language, "realizacje.browse"),
    siteName: settings?.siteName,
    lang,
    path: `/${lang}/realizacje`,
    seo,
    image: settings?.defaultOgImage,
  });
}

export default async function ProjectsPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const searchParamsResolved = await searchParams;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const selectedCategory = searchParamsResolved.category;
  const projects = await getCachedAllProjects(lang as Language);
  const categories = Array.from(
    new Set(projects.map((p) => p.category).filter(Boolean)),
  ).sort();

  const filteredProjects = selectedCategory
    ? projects.filter((p) => p.category === selectedCategory)
    : projects;

  return (
    <>
      <main id="main-content" className="min-h-screen overflow-hidden">
        {/* Tło — rozmyte plamy neonowe */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-violet-500/6 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-26 md:py-36">
          <div className="mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl font-medium mb-6 leading-tight bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              {t(lang as Language, "realizacje.title")}
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl">
              {t(lang as Language, "realizacje.browse")}
            </p>
          </div>

          {categories.length > 0 && (
            <div className="mb-10 lg:mb-12 flex flex-wrap gap-3">
              <Link
                href={`/${lang}/realizacje`}
                className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 ${
                  !selectedCategory
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/60 text-cyan-400 shadow-lg shadow-cyan-500/20"
                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                }`}>
                {t(lang as Language, "common.all")}
              </Link>
              {categories.map((category) => {
                const categoryLabel =
                  projects.find((p) => p.category === category)
                    ?.categoryLabel || category;
                return (
                  <Link
                    key={category}
                    href={`/${lang}/realizacje?category=${encodeURIComponent(category || "")}`}
                    className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/60 text-cyan-400 shadow-lg shadow-cyan-500/20"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                    }`}>
                    {categoryLabel}
                  </Link>
                );
              })}
            </div>
          )}

          {filteredProjects.length > 0 ? (
            <section aria-labelledby="realizacje-list-heading">
              <h2 id="realizacje-list-heading" className="sr-only">
                {t(lang as Language, "realizacje.browse")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredProjects.map((project) => (
                  <Link
                    key={project._id}
                    href={`/${lang}/realizacje/${project.slug}`}
                    className="group flex flex-col rounded-2xl lg:rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/40 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/15 hover:-translate-y-1 relative overflow-hidden">
                    {/* Neonowa linia na górze karty */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="p-3">
                      {project.categoryLabel && (
                        <div className="absolute top-5 left-5 z-10">
                          <Badge
                            variant="outline"
                            className="bg-black/70 backdrop-blur-md border-cyan-400/60 text-cyan-400 text-xs font-medium px-3 py-1 shadow-lg">
                            {project.categoryLabel}
                          </Badge>
                        </div>
                      )}
                      <div className="max-h-[250px] h-full flex items-center justify-center">
                        <Image
                          src={project.image}
                          alt={project.imageAlt || project.title}
                          width={400}
                          height={250}
                          className="object-contain h-full rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="p-5 lg:p-6 pt-2">
                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-gray-400 text-sm lg:text-base line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : (
            <div className="text-center py-20 lg:py-32">
              <p className="text-gray-400 text-xl lg:text-2xl">
                {t(lang as Language, "realizacje.noProjectsInCategory")}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
