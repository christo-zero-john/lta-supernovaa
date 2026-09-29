import type { Metadata } from "next";
import "../../dashboard/_supernova/supernova.css";
import "../dashoard/dashboard.css";
import "../dashoard/testimonial-gradients.css";
import "../../dashboard/_supernova/reference-fonts.css";
import "../../dashboard/_supernova/button-motion.css";
export const metadata: Metadata = {
  title: "Supernova - One LTA Account",
  description: "Your entire Letters to Abroad journey, in one place.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="lta-reference-root">{children}</div>;
}
