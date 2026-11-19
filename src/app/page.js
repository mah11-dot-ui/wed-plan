import { Suspense } from "react";

import Banner from "@/components/banner";
import FeaturedServices from "@/components/sections/featured-services";
import {
  FeaturedServicesFallback,
  ServiceCategoriesFallback,
} from "@/components/sections/fallbacks";
import HowItWorks from "@/components/sections/how-it-works";
import ServiceCategories from "@/components/sections/service-categories";
import WhyChoose from "@/components/sections/why-choose";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* static — prerendered into the shell */}
      <Banner />

      {/* dynamic — streamed per request */}
      <Suspense fallback={<FeaturedServicesFallback />}>
        <FeaturedServices />
      </Suspense>
      <Suspense fallback={<ServiceCategoriesFallback />}>
        <ServiceCategories />
      </Suspense>

      {/* static — prerendered into the shell */}
      <WhyChoose />
      <HowItWorks />
    </main>
  );
}
