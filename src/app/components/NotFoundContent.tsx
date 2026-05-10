"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { type Language } from "@/i18n/config";
import { t } from "@/i18n/dictionary";

type Props = {
  lang: Language;
};

export default function NotFoundContent({ lang }: Props) {
  const router = useRouter();

  return (
    <main
      id="main-content"
      className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] rounded-full bg-violet-500/12 blur-[120px]" />
        <div className="absolute top-1/3 right-1/2 w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="max-w-2xl mx-auto text-center py-24">
        <p className="text-7xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent leading-none tracking-tight">
          {t(lang, "notFound.code")}
        </p>

        <div className="mt-6 flex justify-center gap-1.5">
          <div className="h-1 w-16 rounded-full bg-cyan-400/70" />
          <div className="h-1 w-8 rounded-full bg-violet-400/50" />
          <div className="h-1 w-4 rounded-full bg-blue-400/40" />
        </div>

        <h1 className="mt-8 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
          {t(lang, "notFound.heading")}
        </h1>

        <p className="mt-5 text-lg text-gray-400 leading-relaxed">
          {t(lang, "notFound.description")}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 transition-all text-white font-medium w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t(lang, "notFound.goBack")}
          </button>

          <Link
            href={`/${lang}`}
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all text-white font-medium shadow-lg shadow-cyan-500/20 w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            {t(lang, "notFound.goHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
