'use client';

import { useState } from 'react';
import Link from 'next/link';
import Container from '@/components/Container';

const links = [
    { href: '/', label: 'Inicio' },
    { href: '/formulario', label: 'Formulario' },
    { href: '/privacidad', label: 'Privacidad' },
];

export default function NavHeader() {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
            <Container className="flex items-center justify-between py-4 md:py-6">
                <Link href="/" onClick={() => setOpen(false)}>
                    <img src="/rtcae_logo.png" className="h-12 md:h-14 w-auto scale-125 origin-left" />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
                    {links.map(l => (
                        <Link key={l.href} href={l.href} className="hover:text-black transition">
                            {l.label.toUpperCase()}
                        </Link>
                    ))}
                </nav>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    onClick={() => setOpen(o => !o)}
                    aria-label="Menú"
                >
                    <span style={{
                        display: 'block', width: '22px', height: '2px',
                        background: '#1a2a3a', borderRadius: '2px',
                        transition: 'transform 0.2s',
                        transform: open ? 'translateY(7px) rotate(45deg)' : 'none',
                    }} />
                    <span style={{
                        display: 'block', width: '22px', height: '2px',
                        background: '#1a2a3a', borderRadius: '2px',
                        opacity: open ? 0 : 1, transition: 'opacity 0.2s',
                    }} />
                    <span style={{
                        display: 'block', width: '22px', height: '2px',
                        background: '#1a2a3a', borderRadius: '2px',
                        transition: 'transform 0.2s',
                        transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none',
                    }} />
                </button>
            </Container>

            {/* Mobile dropdown */}
            <div style={{
                overflow: 'hidden',
                maxHeight: open ? '200px' : '0',
                transition: 'max-height 0.25s ease',
                background: 'white',
                borderTop: open ? '1px solid #e4eaf0' : 'none',
            }}>
                <nav className="flex flex-col">
                    {links.map(l => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            style={{
                                padding: '14px 24px',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#1a2a3a',
                                borderBottom: '1px solid #f0f4f8',
                                textDecoration: 'none',
                            }}
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}