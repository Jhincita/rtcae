import Link from 'next/link';

export default function PaymentSuccessPage({
                                               searchParams,
                                           }: {
    searchParams: { appointmentId?: string };
}) {
    const appointmentId = searchParams.appointmentId;

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div style={{
                background: 'white', borderRadius: '16px', padding: '2.5rem',
                maxWidth: '580px', width: '100%', boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                textAlign: 'center',
            }}>
                <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: '#e6f1fb', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '24px',
                }}>
                    ✓
                </div>

                <p style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1a2a3a', marginBottom: '1rem' }}>
                    Solicitud recibida
                </p>

                <p style={{ fontSize: '14px', color: '#3a4e62', lineHeight: '1.7', marginBottom: '1rem' }}>
                    Su solicitud de asesoría ha sido recibida y procesada correctamente. En los próximos minutos recibirá un correo de confirmación con los detalles de su sesión, incluyendo fecha, hora y modalidad de conexión.
                </p>

                <p style={{ fontSize: '14px', color: '#3a4e62', lineHeight: '1.7', marginBottom: '1rem' }}>
                    En la reunión, un profesional del estudio jurídico Resuelve Tu CAE analizará su situación en relación con la notificación recibida y le informará sobre las acciones legales disponibles según el estado actual de su proceso. Si tiene consultas previas a la reunión, puede escribirnos a{' '}
                    <a href="mailto:contacto@resuelvetucae.com" style={{ color: '#185FA5' }}>
                        contacto@resuelvetucae.com
                    </a>.
                </p>

                <p style={{ fontSize: '14px', color: '#6b7c8d', marginBottom: '1.75rem' }}>
                    Agradecemos su confianza.
                </p>

                {appointmentId && (
                    <p style={{ fontSize: '12px', color: '#8fa3b8', marginBottom: '1.5rem' }}>
                        ID de referencia: {appointmentId}
                    </p>
                )}

                <Link href="/" style={{
                    display: 'inline-block', background: '#185FA5', color: 'white',
                    borderRadius: '8px', padding: '10px 28px', fontSize: '14px',
                    fontWeight: 600, textDecoration: 'none',
                }}>
                    Volver al inicio
                </Link>
            </div>
        </main>
    );
}