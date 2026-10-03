import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Anek_Bangla, Inter, Geist, Rubik, Manrope, Momo_Trust_Sans } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll/SmoothScroll";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-plus-jakarta-sans",
});
const anekBangla = Anek_Bangla({
    subsets: ["latin"],
    variable: "--font-anek-bangla",
});

// The dashboard's display face, shared with the LTA website design.
const momoTrustSans = Momo_Trust_Sans({
    subsets: ["latin"],
    variable: "--font-momo-trust-sans",
});

const inter = Inter({ subsets: ["latin"], variable: "--figma-inter" });
const geist = Geist({ subsets: ["latin"], variable: "--figma-geist" });
const rubik = Rubik({ subsets: ["latin"], style: ["normal", "italic"], variable: "--figma-rubik" });
const manrope = Manrope({ subsets: ["latin"], variable: "--figma-manrope" });

export const metadata: Metadata = {
    title: {
        default: "Letters to Abroad",
        template: "%s · Letters to Abroad",
    },
    description: "Letters to Abroad",
};
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${plusJakartaSans.variable} ${anekBangla.variable} ${momoTrustSans.variable} ${inter.variable} ${geist.variable} ${rubik.variable} ${manrope.variable}`}>
        <body>
        <SmoothScroll/>
        {children}
        </body>
        </html>
    );
}
