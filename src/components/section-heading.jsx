import { cn } from "cn";

export default function SectionHeading({
  overline,
  title,
  description,
  tone = "default",
  align = "left",
  className,
}) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p
        className={cn(
          "text-[11px] font-semibold uppercase tracking-[0.22em]",
          dark ? "text-gold" : "text-garnet"
        )}
      >
        {overline}
      </p>
      <h2
        className={cn(
          "mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl",
          dark ? "text-parchment" : "text-espresso"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-3 text-base leading-7",
            dark ? "text-parchment/70" : "text-espresso/70"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
