import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SharkSocial",
  description: "Rede social da comunidade SharkCoders",
  icons: {
    icon: [
      { url: "/logo.png" }
    ]
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className="dark">
      <body
        className="
          min-h-screen
          flex
          flex-col
          text-white
          bg-black
          from-[#FB923C]
          via-[#EA580C]
          to-[#9A3412]
        "
      >
        {/* BACKGROUND EFFECTS */}
        <div className="fixed inset-0 -z-10 overflow-hidden">

          {/* GLOW CENTRAL */}
          <div className="
            absolute
            top-[-250px]
            left-1/2
            -translate-x-1/2
            w-[900px]
            h-[900px]
            bg-violet-600
            opacity-25
            blur-[180px]
            rounded-full
          " />

          {/* GLOW RIGHT */}
          <div className="
            absolute
            top-[10%]
            right-[-200px]
            w-[700px]
            h-[700px]
            bg-fuchsia-500
            opacity-20
            blur-[180px]
            rounded-full
          " />

          {/* GLOW LEFT */}
          <div className="
            absolute
            bottom-[-150px]
            left-[-150px]
            w-[650px]
            h-[650px]
            bg-purple-700
            opacity-20
            blur-[170px]
            rounded-full
          " />

          {/* GLOW SECONDARY */}
          <div className="
            absolute
            bottom-[15%]
            right-[15%]
            w-[350px]
            h-[350px]
            bg-violet-400
            opacity-15
            blur-[140px]
            rounded-full
          " />

          {/* GLOW EXTRA */}
          <div className="
            absolute
            top-[45%]
            left-[10%]
            w-[250px]
            h-[250px]
            bg-purple-400
            opacity-10
            blur-[120px]
            rounded-full
          " />

        </div>

        {/* NAVBAR */}
        <Navbar />

        {/* MAIN */}
        <main className="
          flex-1
          max-w-6xl
          mx-auto
          w-full
          px-4
          py-8
          relative
          z-10
        ">
          {children}
        </main>

        {/* FOOTER */}
        <Footer />
      </body>
    </html>
  );
}