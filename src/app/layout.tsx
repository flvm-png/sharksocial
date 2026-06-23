import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SharkEvents",
  description: "Plataforma de eventos e check-ins",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body
        className="
          min-h-screen
          flex flex-col
          text-[#F8FAFC]
          bg-gradient-to-b
          from-[#0B0B14]
          via-[#0F1022]
          to-[#0B0B14]
        "
      >
        {/* 🌌 BACKGROUND EFFECTS */}
        <div className="fixed inset-0 -z-10 overflow-hidden">

          {/* 🟣 ROXO (branding principal) */}
          <div className="
            absolute
            top-[-220px]
            left-1/2
            -translate-x-1/2
            w-[650px]
            h-[650px]
            bg-[#7C3AED]
            opacity-20
            blur-[140px]
            rounded-full
          " />

          {/* 🟠 LARANJA (energia / Sharkcoders accent) */}
          <div className="
            absolute
            bottom-[-220px]
            right-[-120px]
            w-[550px]
            h-[550px]
            bg-[#F97316]
            opacity-15
            blur-[150px]
            rounded-full
          " />

          {/* 🟣 pequeno highlight secundário */}
          <div className="
            absolute
            top-[40%]
            left-[10%]
            w-[300px]
            h-[300px]
            bg-[#A855F7]
            opacity-10
            blur-[120px]
            rounded-full
          " />

        </div>

        {/* HEADER */}
        <Navbar />

        {/* MAIN */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 relative z-10">
          {children}
        </main>

        {/* FOOTER */}
        <Footer />
      </body>
    </html>
  );
}