"use client";

import dynamic from "next/dynamic";

const Aurora = dynamic(() => import("./Aurora"), { ssr: false });

export default function AuroraBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}>
      <Aurora
        colorStops={["#182e60", "#405f92"]}
        blend={0.5}
        amplitude={0.5}
        speed={0.7}
      />
    </div>
  );
}
