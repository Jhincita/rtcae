import Form from '../components/Form'
import Link from 'next/link';

export default function Intro() {
    return (
        <section className="max-w-4xl mx-auto px-6 py-12">
            {/* Image on top */}
            <div className="mb-8">
                <img
                    src="/rtcae_colored.png"  // Replace with your actual image path
                    alt="Legal consultation"
                    className="w-full h-auto"
                />
            </div>
            {/* Full‑width text line */}
            <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen mt-12 py-4 text-center text-2xl md:text-3xl font-bold tracking-wide"
                 style={{ color: '#4F51B3' }}>
                PONGÁMONOS EN CONTACTO
            </div>

            {/* Botón elegante */}
            <div className="flex justify-center mt-8">
                <Link href="/formulario">
                    <button className="group relative px-8 py-3 overflow-hidden rounded-lg border border-[#4F51B3] text-[#4F51B3] transition-all duration-300 hover:bg-[#4F51B3] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#4F51B3] focus:ring-offset-2">
        <span className="relative z-10 font-medium text-base md:text-lg tracking-wide">
            COMPLETA EL FORMULARIO AQUÍ
        </span>
                    </button>
                </Link>
            </div>

        </section>
    );
}