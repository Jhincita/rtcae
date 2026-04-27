// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import FacebookPixel from "@/components/FacebookPixel";
import NavHeader from "@/components/NavHeader";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Resuelve tu CAE",
    description: "Asesoría legal para controlar tu deuda del Crédito con Aval del Estado CAE.",
    icons: {
        icon: [
            { url: "/favicon_128.png", sizes: "any" },
            { url: "/favicon_16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon_32.png", sizes: "32x32", type: "image/png" },
        ],
        apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
    },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <NavHeader />
        <main className="flex-grow pt-20">
            {children}
        </main>
        <Footer />
        <FacebookPixel />
        </body>
        </html>
    );
}