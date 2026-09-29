import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Anek_Bangla,
  Inter,
  Geist,
  Rubik,
  Manrope,
} from "next/font/google";
import "./supernova.css";
import "../dashoard/dashboard.css";
import "../dashoard/testimonial-gradients.css";
import "./button-motion.css";
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--sn-body",
});
const anek = Anek_Bangla({ subsets: ["latin"], variable: "--sn-heading" });
const inter = Inter({ subsets: ["latin"], variable: "--figma-inter" });
const geist = Geist({ subsets: ["latin"], variable: "--figma-geist" });
const rubik = Rubik({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--figma-rubik",
});
const manrope = Manrope({ subsets: ["latin"], variable: "--figma-manrope" });
export const metadata: Metadata = {
  title: "Supernova · One LTA Account",
  description: "Your entire Letters to Abroad journey, in one place.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`lta-reference-root ${jakarta.variable} ${anek.variable} ${inter.variable} ${geist.variable} ${rubik.variable} ${manrope.variable}`}
    >
      {children}
    </div>
  );
}
