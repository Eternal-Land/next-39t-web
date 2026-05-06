import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getHeroSection } from "@/actions/landing";

// Default data for when database is empty
const defaultHeroData = {
  title: "We build modern web experiences",
  subtitle:
    "A small team of passionate young developers crafting beautiful, performant, and scalable web applications. We turn ideas into reality.",
  primaryButtonText: "View Our Work",
  primaryButtonLink: "#projects",
  secondaryButtonText: "Get in Touch",
  secondaryButtonLink: "#contact",
};

export default async function LandingHero() {
  const heroData = (await getHeroSection()) || defaultHeroData;

  return (
    <section className="container mx-auto px-4 py-72 text-center md:py-72">
      <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
        {heroData.title.includes("modern web") ? (
          <>
            We build{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              modern web
            </span>{" "}
            experiences
          </>
        ) : (
          heroData.title
        )}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
        {heroData.subtitle}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button size="lg" asChild>
          <a href={heroData.primaryButtonLink}>
            {heroData.primaryButtonText}
            <ArrowRight className="ml-2 size-4" />
          </a>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <a href={heroData.secondaryButtonLink}>
            {heroData.secondaryButtonText}
          </a>
        </Button>
      </div>
    </section>
  );
}
