import { connection } from "next/server";

import Banner from "@/components/banner";
import FeaturedServices from "@/components/sections/featured-services";
import HowItWorks from "@/components/sections/how-it-works";
import ServiceCategories from "@/components/sections/service-categories";
import WhyChoose from "@/components/sections/why-choose";

// Blocking route — featured services and categories are served fresh at
// request time (no static-shell streaming).
export const instant = false;

export default async function Home() {
  await connection();

  return (
    <main className="flex flex-1 flex-col">
      <Banner />
      <FeaturedServices />
      <ServiceCategories />
      <WhyChoose />
      <HowItWorks />
    </main>
  );
}
