"use client";

import dynamic from "next/dynamic";

const HeroBanner = dynamic(() => import("@/components/store/HeroBanner"), {
  ssr: false,
});

export default function HomeHeroClient() {
  return <HeroBanner />;
}
