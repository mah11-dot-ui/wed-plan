"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";

const EASE = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export default function Banner() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="banner-heading"
      className="relative flex min-h-[560px] items-center overflow-hidden border-b border-cream-300 sm:min-h-[620px]"
    >
      {/* slow cinematic settle on the hero photo */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.14 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.9, ease: EASE }}
      >
        <Image
          src="/images/wedding-hero.jpg"
          alt="Bride and groom exchanging wedding rings outdoors on green grass"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[74%_center]"
        />
      </motion.div>
      {/* soft cream wash — keeps copy readable while letting the photo breathe */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-cream via-cream/85 to-cream/5 sm:via-cream/70"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          className="flex max-w-xl flex-col items-start gap-6"
          variants={containerVariants}
          initial={reduce ? false : "hidden"}
          animate="show"
        >
          <motion.p
            variants={itemVariants}
            className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-garnet"
          >
            <span aria-hidden="true" className="h-px w-10 bg-gold" />
            <Sparkles className="size-3.5" aria-hidden="true" />
            Wedding Planning Marketplace
          </motion.p>

          <motion.h1
            variants={itemVariants}
            id="banner-heading"
            className="font-display text-5xl leading-[1.04] tracking-tight text-espresso sm:text-6xl"
          >
            Your dream wedding,
            <br />
            <span className="font-semibold italic text-garnet">
              beautifully planned.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-md text-base leading-7 text-espresso/80 sm:text-lg sm:leading-8"
          >
            Venues, décor, photography, catering and more — compare trusted
            local vendors in one place and build your perfect day with total
            confidence.
          </motion.p>

          <motion.div variants={itemVariants} className="pt-1">
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.04, y: -1 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
            >
              <Button
                size="lg"
                className="group h-12 rounded-full bg-garnet px-7 text-[15px] font-semibold text-garnet-foreground hover:bg-garnet-deep"
                render={<Link href="/services" />}
              >
                Explore Wedding Services
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 pt-1"
          >
            <div
              className="flex items-center gap-0.5"
              role="img"
              aria-label="Rated 4.9 out of 5"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <motion.span
                  key={i}
                  className="inline-flex"
                  initial={
                    reduce ? false : { opacity: 0, scale: 0, rotate: -45 }
                  }
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 15,
                    delay: 0.65 + i * 0.08,
                  }}
                >
                  <Star
                    className="size-4 fill-gold text-gold"
                    aria-hidden="true"
                  />
                </motion.span>
              ))}
            </div>
            <p className="text-xs text-espresso/70 sm:text-sm">
              4.9/5 · 2,400+ weddings planned
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
