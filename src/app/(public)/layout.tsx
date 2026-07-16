export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { AnimatedNavbar } from "@/components/landing/animated-navbar";
import { AnimatedFooter } from "@/components/landing/animated-footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnimatedNavbar />
      <main className="flex-1 w-full">{children}</main>
      <AnimatedFooter />
    </>
  );
}
