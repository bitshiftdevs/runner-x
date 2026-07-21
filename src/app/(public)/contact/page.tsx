import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Runnerx",
  description: "Get in touch with the Runnerx team for support, partnerships, or inquiries.",
};

export default function ContactPage() {
  return (
    <div className="w-full relative bg-surface-container-lowest pb-32">
      
      {/* Clean Premium Hero */}
      <section className="pt-48 pb-24 px-6 text-center">
        <div className="w-full max-w-[768px] mx-auto">
          <h1 className="font-sans text-5xl md:text-7xl font-black text-on-surface tracking-tight mb-6">
            Get in touch
          </h1>
          <p className="font-sans text-xl text-on-surface-variant leading-relaxed mx-auto max-w-[600px]">
            Whether you need support with an ongoing quest or want to bring Runnerx to your campus, our team is here to help.
          </p>
        </div>
      </section>

      {/* Grid of Contact Options */}
      <section className="px-6">
        <div className="w-full max-w-[1024px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Email Block */}
          <div className="bg-surface rounded-3xl p-10 md:p-12 shadow-[0_4px_40px_-10px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl text-primary">mail</span>
            </div>
            <h3 className="font-sans text-2xl font-bold text-on-surface mb-3">Email Support</h3>
            <p className="font-sans text-on-surface-variant mb-6">
              For general inquiries, account issues, or payment support.
            </p>
            <a href="mailto:admins@bitshiftdevs.com" className="font-sans text-lg font-bold text-primary hover:text-primary/80 transition-colors">
              admins@bitshiftdevs.com
            </a>
          </div>

          {/* Business & Partnerships */}
          <div className="bg-surface rounded-3xl p-10 md:p-12 shadow-[0_4px_40px_-10px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl text-primary">handshake</span>
            </div>
            <h3 className="font-sans text-2xl font-bold text-on-surface mb-3">Partnerships</h3>
            <p className="font-sans text-on-surface-variant mb-6">
              Want to launch Runnerx on your campus or partner with Bitshift?
            </p>
            <a href="mailto:admins@bitshiftdevs.com" className="font-sans text-lg font-bold text-primary hover:text-primary/80 transition-colors">
              admins@bitshiftdevs.com
            </a>
          </div>

          {/* Location */}
          <div className="bg-surface rounded-3xl p-10 md:p-12 shadow-[0_4px_40px_-10px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300">
            <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl text-on-surface">location_on</span>
            </div>
            <h3 className="font-sans text-2xl font-bold text-on-surface mb-3">Location</h3>
            <p className="font-sans text-on-surface-variant">
              Built in Kumasi, Ghana.<br/>
              Kwame Nkrumah University of Science and Technology (KNUST).
            </p>
          </div>

          {/* Operating Hours */}
          <div className="bg-surface rounded-3xl p-10 md:p-12 shadow-[0_4px_40px_-10px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300">
            <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl text-on-surface">schedule</span>
            </div>
            <h3 className="font-sans text-2xl font-bold text-on-surface mb-3">Support Hours</h3>
            <p className="font-sans text-on-surface-variant">
              Monday – Friday<br/>
              8:00 AM – 8:00 PM GMT
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
