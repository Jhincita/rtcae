'use client';

import { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { getAvailableSlots } from '@/actions/slots';
import { createPendingAppointment } from '@/actions/createPendingAppointment';
import 'react-day-picker/dist/style.css';

type Slot = { id: string; startTime: string; endTime: string };

type Props = {
    clientId: string;
    clientName: string;
};

export default function BookingCalendar({ clientId, clientName }: Props) {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot>();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string>();

    useEffect(() => {
        if (!selectedDate) return;
        const fetchSlots = async () => {
            setLoading(true);
            const data = await getAvailableSlots(selectedDate);
            setSlots(data);
            setSelectedSlot(undefined);
            setLoading(false);
        };
        fetchSlots();
    }, [selectedDate]);

    const handleSubmit = async () => {
        if (!selectedDate || !selectedSlot) {
            setError('Selecciona fecha y hora.');
            return;
        }
        setSubmitting(true);
        const result = await createPendingAppointment({
            clientId,
            selectedDate,
            slotStartTime: selectedSlot.startTime,
            slotEndTime: selectedSlot.endTime,
        });
        if (result.success && result.paymentUrl) {
            window.location.href = result.paymentUrl;
        } else {
            setError(result.error || 'Error al iniciar pago');
            setSubmitting(false);
        }
    };

    const formattedDate = selectedDate?.toLocaleDateString('es-CL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });

    return (
        <div className="booking-wrapper">
            <style>{`
                .booking-wrapper {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    max-width: 700px;
                    width: 100%;
                    box-shadow: 0 2px 16px rgba(0,0,0,0.08);
                }
                .booking-title {
                    font-size: 1.4rem;
                    font-weight: 600;
                    color: #1a2a3a;
                    margin-bottom: 4px;
                }
                .booking-subtitle {
                    font-size: 0.9rem;
                    color: #6b7c8d;
                    margin-bottom: 1.5rem;
                }
                .booking-body {
                    display: flex;
                    gap: 0;
                    align-items: flex-start;
                }
                .booking-divider {
                    width: 1px;
                    background: #e4eaf0;
                    align-self: stretch;
                    margin: 0 1.5rem;
                    flex-shrink: 0;
                }
                .section-label {
                    font-size: 11px;
                    font-weight: 600;
                    color: #8fa3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.07em;
                    margin-bottom: 12px;
                }
                .slots-panel {
                    flex: 1;
                    min-width: 0;
                }
                .slot-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                }
                .slot-btn {
                    border: 1px solid #d0dce8;
                    background: white;
                    border-radius: 8px;
                    padding: 10px 8px;
                    font-size: 13px;
                    color: #2c4a6b;
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.15s;
                    font-family: inherit;
                }
                .slot-btn:hover {
                    background: #f0f5fa;
                    border-color: #a5bad1;
                }
                .slot-btn.selected {
                    border-color: #185FA5;
                    background: #e6f1fb;
                    color: #185FA5;
                    font-weight: 600;
                }
                .confirm-bar {
                    background: #f5f8fb;
                    border-radius: 10px;
                    padding: 14px 18px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 1.5rem;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .confirm-info {
                    font-size: 13px;
                    color: #6b7c8d;
                }
                .confirm-info strong {
                    color: #1a2a3a;
                    font-weight: 600;
                }
                .confirm-btn {
                    background: #185FA5;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 10px 22px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    font-family: inherit;
                    transition: background 0.15s;
                    white-space: nowrap;
                }
                .confirm-btn:hover {
                    background: #0c447c;
                }
                .confirm-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .slots-empty {
                    font-size: 13px;
                    color: #8fa3b8;
                    padding: 12px 0;
                }
                .error-msg {
                    font-size: 13px;
                    color: #c0392b;
                    margin-top: 8px;
                }
                /* DayPicker overrides to match RTC palette */
                .rdp {
                    --rdp-accent-color: #185FA5;
                    --rdp-background-color: #e6f1fb;
                    --rdp-accent-color-dark: #185FA5;
                    --rdp-background-color-dark: #e6f1fb;
                    margin: 0 !important;
                }
                .rdp-day_selected, .rdp-day_selected:hover {
                    background-color: #185FA5 !important;
                    color: white !important;
                }
                .rdp-button:hover:not([disabled]) {
                    background-color: #f0f5fa !important;
                }
                .rdp-head_cell {
                    font-size: 11px !important;
                    color: #8fa3b8 !important;
                    font-weight: 600 !important;
                    text-transform: uppercase !important;
                }
                .rdp-caption_label {
                    font-size: 15px !important;
                    font-weight: 600 !important;
                    color: #1a2a3a !important;
                }
                @media (max-width: 580px) {
                    .booking-body {
                        flex-direction: column;
                    }
                    .booking-divider {
                        width: 100%;
                        height: 1px;
                        margin: 1.25rem 0;
                    }
                }
            `}</style>

            <p className="booking-title">Agendar asesoría</p>
            <p className="booking-subtitle">
                Bienvenido, {clientName}. Selecciona una fecha y hora disponible.
            </p>

            <div className="booking-body">
                {/* Calendar */}
                <div>
                    <div className="section-label">Fecha</div>
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={es}
                        disabled={{ before: new Date() }}
                    />
                </div>

                <div className="booking-divider" />

                {/* Slots */}
                <div className="slots-panel">
                    {!selectedDate ? (
                        <p className="slots-empty">Selecciona una fecha para ver horarios.</p>
                    ) : (
                        <>
                            <div className="section-label">
                                Horarios — {formattedDate}
                            </div>
                            {loading ? (
                                <p className="slots-empty">Cargando...</p>
                            ) : slots.length === 0 ? (
                                <p className="slots-empty">No hay horarios disponibles.</p>
                            ) : (
                                <div className="slot-grid">
                                    {slots.map(slot => (
                                        <button
                                            key={slot.id}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`slot-btn ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                                        >
                                            {slot.startTime} – {slot.endTime}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Confirm bar */}
            {selectedSlot && selectedDate && (
                <div className="confirm-bar">
                    <div className="confirm-info">
                        <strong>{formattedDate}</strong>
                        {' · '}
                        {selectedSlot.startTime} – {selectedSlot.endTime}
                        {' · '}
                        <strong>$25.000 CLP</strong>
                    </div>
                    <button
                        className="confirm-btn"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? 'Procesando...' : 'Pagar y confirmar →'}
                    </button>
                </div>
            )}

            {error && <p className="error-msg">{error}</p>}
        </div>
    );
}