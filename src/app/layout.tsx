import type { Metadata } from "next";
import { Sora, Source_Serif_4, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

export const metadata: Metadata = {
  title: "PharmaPrep Uganda | Pass Your Pharmacy Licensing Exam",
  description:
    "Online exam prep for Ugandan pharmacy graduates preparing for pre-licensure and post-internship licensing exams.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${sourceSerif.variable} ${dmSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
