import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Anek_Bangla } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-plus-jakarta-sans",
});
const anekBangla = Anek_Bangla({
    subsets: ["latin"],
    variable: "--font-anek-bangla",
});

export const metadata: Metadata = {
    title: "Letters to Abroad",
    description: "Letters to Abroad",
};
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${plusJakartaSans.variable} ${anekBangla.variable}`}>
        <body>{children}</body>
        </html>
    );
}
