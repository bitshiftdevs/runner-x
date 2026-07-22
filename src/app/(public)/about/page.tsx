import type { Metadata } from "next";
import Image from "next/image";
import { FadeIn } from "@/components/animations/fade-in";

export const metadata: Metadata = {
  title: "About — Runnerx",
  description: "Learn about Runnerx, a product of Bitshift. The student-only dispatch marketplace for university campuses in Ghana.",
};

const team = [
  {
    name: "Joseph Osei Aboagye",
    role: "CTO & Co-Founder",
    image: "/team/Joseph Osei Aboagye.jpg",
  },
  {
    name: "Nana Essilfie Mbeah",
    role: "CTO & Co-Founder",
    image: "/team/Prince Essilfie Mbeah.jpg",
  },
  {
    name: "Vincent Otchere",
    role: "Founder",
    image: "/team/Vincent New.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full relative bg-surface-container-lowest">
      
      {/* Hero Section */}
      <section className="pt-48 pb-24 px-6 relative overflow-hidden bg-[#0a0f0e] text-white">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary rounded-full blur-[150px]" />
        </div>
        
        <div className="w-full max-w-[1024px] mx-auto relative z-10 text-center">
          <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
            We built the <br />
            <span className="text-primary italic">campus economy</span> <br />
            we wished we had.
          </h1>
          <p className="font-sans text-xl md:text-2xl text-white/70 max-w-[768px] mx-auto leading-relaxed">
            Runnerx is a hyper-local dispatch marketplace designed exclusively for university campuses across Ghana. 
            A proud product of <strong className="text-white font-bold">Bitshift</strong>.
          </p>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-24 md:py-32 px-6">
        <div className="w-full max-w-[1024px] mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          <div className="w-full lg:w-1/2">
            <div className="relative w-full max-w-[400px] mx-auto aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl bg-surface-container">
              <Image 
                src="/runner-avatar.jpg" 
                alt="Runner" 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 border-4 border-surface rounded-[2rem] pointer-events-none" />
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
            <h2 className="font-sans text-4xl md:text-5xl font-black text-on-surface tracking-tight">
              By alumni, <br />
              <span className="text-primary">for students.</span>
            </h2>
            <div className="space-y-6 font-sans text-lg text-on-surface-variant leading-relaxed">
              <p>
                As former KNUST students, we knew the exact pain points of campus life. You're either stuck in a 2-hour gap between lectures with nothing to do, or you're desperately trying to get food delivered to your hostel while studying for midterms.
              </p>
              <p>
                We realized that the solution wasn't a massive corporate delivery app. The solution was the students themselves. 
              </p>
              <p>
                By connecting Requesters (students who need errands done) with Runners (students who want to make money between classes), we created a closed-loop, hyper-local economy that is faster, safer, and more reliable than anything else out there.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* The Team Section */}
      <section className="py-24 md:py-32 px-6 bg-surface">
        <div className="w-full max-w-[1280px] mx-auto">
          
          <div className="text-center mb-20">
            <h2 className="font-sans text-4xl md:text-6xl font-black text-on-surface tracking-tight uppercase">
              The <span className="text-primary">Bitshift</span> Team
            </h2>
            <p className="font-mono text-lg text-on-surface-variant mt-4">
              Proud alumni of Kwame Nkrumah University of Science and Technology (KNUST).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1024px] mx-auto">
            {team.map((member, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden mb-6 shadow-xl border-4 border-surface-container transition-transform duration-300 group-hover:scale-105 group-hover:border-primary">
                  <Image 
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="font-sans text-2xl font-bold text-on-surface text-center">
                  {member.name}
                </h3>
                <p className="font-mono text-sm text-primary uppercase tracking-widest mt-2 font-bold">
                  {member.role}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
