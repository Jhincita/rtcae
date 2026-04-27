'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BookingCalendar from '@/components/BookingCalendar';
import AgreementModal from '@/components/AgreementModal';

function AgendarContent() {
    const searchParams = useSearchParams();
    const clientId = searchParams.get('clientId');
    const [client, setClient] = useState<{ name: string } | null>(null);
    const [agreementAccepted, setAgreementAccepted] = useState(false);

    useEffect(() => {
        if (clientId) {
            fetch(`/api/clients?id=${clientId}`)
                .then(res => res.json())
                .then(data => setClient(data.client));
        }
    }, [clientId]);

    if (!clientId) return <p className="p-8 text-center text-gray-500">Falta el ID de cliente.</p>;
    if (!client) return <p className="p-8 text-center text-gray-500">Cargando...</p>;

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            {!agreementAccepted && (
                <AgreementModal
                    clientId={clientId}
                    onAccept={() => setAgreementAccepted(true)}
                    onCancel={() => window.location.href = '/'}
                />
            )}
            <BookingCalendar clientId={clientId} clientName={client.name} />
        </main>
    );
}

export default function AgendarPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Cargando calendario...</div>}>
            <AgendarContent />
        </Suspense>
    );
}