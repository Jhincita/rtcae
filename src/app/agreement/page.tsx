'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AgreementPage() {
    const [accepted, setAccepted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const clientId = searchParams.get('clientId');

    const handleContinue = () => {
        if (accepted && clientId) {
            router.push(`/agendar?clientId=${clientId}`);
        }
    };

    return (
        <main className="container mx-auto p-4">
            <div className="card max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Aviso importante</h1>
                <p className="mb-4">
                    Reconozco que voy a ser redirigido a un portal de pago para poder agendar mi reunión de asesoramiento.
                    El pago es obligatorio para confirmar la cita.
                </p>
                <div className="flex items-center gap-2 mb-6">
                    <input
                        type="checkbox"
                        id="accept"
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                    />
                    <label htmlFor="accept">Acepto los términos y condiciones</label>
                </div>
                <button
                    onClick={handleContinue}
                    disabled={!accepted}
                    className="btn-primary w-full"
                >
                    Continuar
                </button>
                <div className="mt-4 text-center">
                    <Link href="/" className="text-sm text-gray-500">Cancelar</Link>
                </div>
            </div>
        </main>
    );
}