import type { Metadata } from "next";
import Link from "next/link";
import { AppStoreButtons } from "@/components/ui/app-store-buttons";
import { HeroSection } from "@/components/landing/hero-section";
import { CategoriesSection } from "@/components/landing/categories-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { EarnSection } from "@/components/landing/earn-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";

export const metadata: Metadata = {
  title: "Runnerx — Campus Hustle, Delivered Fast",
  description:
    "Student-only hyper-local dispatch marketplace for university campuses in Ghana. Get errands done or earn money between classes.",
};

export default function LandingPage() {
  return (
    <div className="w-full relative">
      <HeroSection />
      <CategoriesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <EarnSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
