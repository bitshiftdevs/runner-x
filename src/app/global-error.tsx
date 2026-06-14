"use client";

export const dynamic = "force-dynamic";

export default function GlobalError() {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex items-center justify-center bg-[#131315] text-[#e5e1e4]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Something went wrong!</h2>
          <a href="/" className="mt-4 inline-block px-4 py-2 bg-[#d0bcff] text-[#3c0091] rounded-lg">
            Go Home
          </a>
        </div>
      </body>
    </html>
  );
}
