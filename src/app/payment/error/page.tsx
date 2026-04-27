import Link from 'next/link';

export default function PaymentErrorPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div style={{
                background: 'white', borderRadius: '16px', padding: '2.5rem',
                maxWidth: '580px', width: '100%', boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                textAlign: 'center',
            }}>
                <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: '#fceaea', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 1.25rem',
                    fontSize: '22px', color: '#c0392b',
                }}>
                    ✗
                </div>

                <p style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1a2a3a', marginBottom: '1rem' }}>
                    No pudimos procesar el pago
                </p>

                <p style={{ fontSize: '14px', color: '#3a4e62', lineHeight: '1.7', marginBottom: '1.75rem' }}>
                    Ocurrió un problema al procesar tu pago. Por favor intenta nuevamente o contáctanos a{' '}
                    <a href="mailto:contacto@resuelvetucae.com" style={{ color: '#185FA5' }}>
                        contacto@resuelvetucae.com
                    </a>{' '}
                    si el problema persiste.
                </p>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/" style={{
                        display: 'inline-block', border: '1px solid #d0dce8',
                        background: 'white', color: '#6b7c8d', borderRadius: '8px',
                        padding: '10px 24px', fontSize: '14px', textDecoration: 'none',
                    }}>
                        Ir al inicio
                    </Link>
                    <Link href="/formulario" style={{
                        display: 'inline-block', background: '#185FA5', color: 'white',
                        borderRadius: '8px', padding: '10px 24px', fontSize: '14px',
                        fontWeight: 600, textDecoration: 'none',
                    }}>
                        Intentar de nuevo →
                    </Link>
                </div>
            </div>
        </main>
    );
}