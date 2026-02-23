"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import type { FaqItem } from "@/sanity/faq";

interface FaqAccordionProps {
  items: FaqItem[];
}

function getOpenValueFromHash(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const m = window.location.hash.match(/^#faq-(\d+)$/);
  return m ? `item-${m[1]}` : undefined;
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openValue, setOpenValue] = useState<string | undefined>(() =>
    getOpenValueFromHash()
  );

  useEffect(() => {
    const fromHash = getOpenValueFromHash();
    if (fromHash) {
      setOpenValue(fromHash);
      const id = fromHash.replace("item-", "");
      const el = document.getElementById(`faq-${id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const fromHash = getOpenValueFromHash();
      if (fromHash) setOpenValue(fromHash);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      value={openValue}
      onValueChange={setOpenValue}
    >
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={`faq-${item.id}`}
          value={`item-${item.id}`}
          className="border-white/10 scroll-mt-24"
        >
          <AccordionTrigger className="text-left text-white hover:text-cyan-400 hover:no-underline py-5 text-lg">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-400 leading-relaxed">
            <div className="whitespace-pre-line">{item.answer}</div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
