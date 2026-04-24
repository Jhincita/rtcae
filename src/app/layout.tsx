// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import FacebookPixel from "@/components/FacebookPixel"; // 👈 import the pixel component

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
        <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
            <Container className="flex items-center justify-between py-4 md:py-8">
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <img src="/rtcae_logo.png" className="h-12 md:h-14 w-auto scale-125 origin-left" />
                </Link>
                <nav className="flex gap-4 md:gap-8 text-xs md:text-sm font-medium text-gray-600">
                    <Link href="/" className="hover:text-black transition">INICIO</Link>
                    <Link href="/formulario" className="hover:text-black transition">FORMULARIO</Link>
                    <Link href="/privacidad" className="hover:text-black transition">PRIVACIDAD</Link>
                </nav>
            </Container>
        </header>

        <main className="flex-grow pt-20">
            {children}
        </main>

        <Footer />
        <FacebookPixel /> {/* 👈 Add the pixel component here */}
        </body>
        </html>
    );
}