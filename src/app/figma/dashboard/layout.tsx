import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Anek_Bangla } from "next/font/google";
import "./supernova.css";
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--sn-body",
});
const anek = Anek_Bangla({ subsets: ["latin"], variable: "--sn-heading" });
export const metadata: Metadata = {
  title: "Supernova · One LTA Account",
  description: "Your entire Letters to Abroad journey, in one place.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`supernova ${jakarta.variable} ${anek.variable}`}>
      {children}
    </div>
  );
}
