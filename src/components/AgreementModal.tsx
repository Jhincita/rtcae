'use client';

import { useState } from 'react';

type Props = {
    clientId: string;
    onAccept: () => void;
    onCancel: () => void;
};

export default function AgreementModal({ clientId, onAccept, onCancel }: Props) {
    const [accepted, setAccepted] = useState(false);

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(20, 35, 50, 0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '1rem',
        }}>
            <div style={{
                background: 'white', borderRadius: '16px',
                padding: '2rem', maxWidth: '560px', width: '100%',
                boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
                maxHeight: '90vh', overflowY: 'auto',
            }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1a2a3a', marginBottom: '0.5rem' }}>
                    Antes de continuar
                </p>
                <p style={{ fontSize: '13px', color: '#6b7c8d', marginBottom: '1.25rem' }}>
                    Queremos que este proceso sea claro y transparente desde el inicio.
                    Aquí van las condiciones del servicio:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                        {
                            n: '1',
                            text: 'Lo que estás agendando es una reunión de asesoría jurídica personalizada con nuestro equipo especializado en deuda CAE. En ella revisaremos tu situación en detalle y te orientaremos sobre las acciones legales disponibles en tu caso concreto.',
                        },
                        {
                            n: '2',
                            text: 'Si por cualquier motivo necesitas cambiar la fecha o el horario, puedes hacerlo sin costo siempre que nos lo avises con al menos 48 horas hábiles de anticipación, escribiéndonos a contacto@resuelvetucae.com. Entendemos que los imprevistos ocurren.',
                        },
                        {
                            n: '3',
                            text: 'Esta sesión es personal e intransferible. Fue diseñada para ti, a partir de tu caso específico. Por eso no es posible ceder el espacio a otra persona.',
                        },
                    ].map(item => (
                        <div key={item.n} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{
                                flexShrink: 0, width: '24px', height: '24px',
                                borderRadius: '50%', background: '#e6f1fb',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '12px', fontWeight: 700, color: '#185FA5',
                            }}>
                                {item.n}
                            </div>
                            <p style={{ fontSize: '13px', color: '#3a4e62', lineHeight: '1.6', margin: 0 }}>
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>

                <div style={{
                    borderTop: '1px solid #e4eaf0', paddingTop: '1.25rem',
                    display: 'flex', flexDirection: 'column', gap: '1rem',
                }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={accepted}
                            onChange={e => setAccepted(e.target.checked)}
                            style={{ marginTop: '2px', accentColor: '#185FA5', flexShrink: 0 }}
                        />
                        <span style={{ fontSize: '13px', color: '#3a4e62' }}>
                            He leído y acepto las condiciones del servicio
                        </span>
                    </label>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={onCancel}
                            style={{
                                flex: 1, padding: '10px', borderRadius: '8px',
                                border: '1px solid #d0dce8', background: 'white',
                                color: '#6b7c8d', fontSize: '14px', cursor: 'pointer',
                                fontFamily: 'inherit',
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onAccept}
                            disabled={!accepted}
                            style={{
                                flex: 2, padding: '10px', borderRadius: '8px',
                                border: 'none',
                                background: accepted ? '#185FA5' : '#d0dce8',
                                color: accepted ? 'white' : '#8fa3b8',
                                fontSize: '14px', fontWeight: 600,
                                cursor: accepted ? 'pointer' : 'not-allowed',
                                fontFamily: 'inherit',
                                transition: 'all 0.15s',
                            }}
                        >
                            Continuar →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}