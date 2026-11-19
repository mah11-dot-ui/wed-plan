import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "cn";
import { formatBDT } from "@/lib/services";

export default function ServiceCard({ service }) {
  const { name, category, priceFrom, location, rating, reviews, vendor } =
    service;

  return (
    <Card className="group/card gap-0 overflow-hidden py-0 transition-shadow duration-300 hover:shadow-xl hover:shadow-garnet/10">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={service.image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
        />
        <Badge
          variant="secondary"
          className="absolute left-3 top-3 border-none bg-cream/95 text-espresso shadow-sm backdrop-blur-sm"
        >
          {category}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-heading text-lg font-semibold leading-snug text-espresso transition-colors duration-300 group-hover/card:text-garnet">
          {name}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-semibold leading-none text-garnet">
            From {formatBDT(priceFrom)}
          </p>
          <p className="flex items-center gap-1 whitespace-nowrap text-xs text-espresso/70">
            <MapPin
              className="size-3.5 shrink-0 text-garnet/70"
              aria-hidden="true"
            />
            {location}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-cream-300 pt-3">
          <p className="flex min-w-0 items-center gap-1.5 text-xs text-espresso/75">
            {vendor.verified ? (
              <BadgeCheck
                className="size-4 shrink-0 text-garnet"
                aria-label="Verified vendor"
              />
            ) : null}
            <span className="truncate font-medium">{vendor.name}</span>
          </p>
          <p className="flex shrink-0 items-center gap-1 text-xs text-espresso/80">
            <Star
              className="size-3.5 fill-gold text-gold"
              aria-hidden="true"
            />
            <span className="font-semibold text-espresso">{rating}</span>
            <span className="text-espresso/50">({reviews})</span>
          </p>
        </div>
      </CardContent>

      <CardFooter className="border-t-0 bg-transparent p-5 pt-0">
        <Link
          href={`/services/${service.slug}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 w-full rounded-full border-cream-300 text-espresso transition-colors hover:border-garnet/40 hover:bg-garnet/5 hover:text-garnet"
          )}
        >
          View Details
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </CardFooter>
    </Card>
  );
}
