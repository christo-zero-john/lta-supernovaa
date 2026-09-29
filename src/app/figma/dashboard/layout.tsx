import type { Metadata } from "next";
import "./supernova.css";
import "../dashoard/dashboard.css";
import "../dashoard/testimonial-gradients.css";
import "./reference-fonts.css";
import "./button-motion.css";
export const metadata: Metadata = {
  title: "Supernova - One LTA Account",
  description: "Your entire Letters to Abroad journey, in one place.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="lta-reference-root">{children}</div>;
}
