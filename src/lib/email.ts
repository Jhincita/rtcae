// src/lib/email.ts
import { Resend } from 'resend';
import crypto from 'crypto';

export const resend = new Resend(process.env.RESEND_API_KEY);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Helper to build ICS attachment
function buildICS({
                      patientName,
                      dateTime,
                      durationMinutes = 45,
                  }: {
    patientName: string;
    dateTime: Date;
    durationMinutes?: number;
}) {
    const start = dateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(dateTime.getTime() + durationMinutes * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0] + 'Z';
    return `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ResuelveTuCAE//Agenda//ES
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${crypto.randomUUID()}
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:Asesoría legal
DESCRIPTION:Cita con ${patientName}
END:VEVENT
END:VCALENDAR
`.trim();
}

// Email sent after successful payment
export async function sendPaymentConfirmedEmail({
                                                    to,
                                                    patientName,
                                                    dateTime,
                                                }: {
    to: string;
    patientName: string;
    dateTime: Date;
}) {
    const formattedDate = dateTime.toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedTime = dateTime.toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
    });

    await resend.emails.send({
        from: 'contacto@resuelvetucae.cl',
        to,
        subject: '✅ Pago confirmado - Tu asesoría está agendada',
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hola ${patientName},</h2>
        <p>Tu pago ha sido procesado exitosamente. Tu cita está <strong>confirmada</strong>.</p>
        <p style="font-size: 18px; font-weight: bold;">
          ${formattedDate} a las ${formattedTime}
        </p>
        <p>Te esperamos. No necesitas realizar ninguna otra acción.</p>
        <p>Adjuntamos el evento a tu calendario para que lo guardes.</p>
        <hr />
        <p style="font-size: 12px; color: #666;">ResuelveTuCAE - Asesoría legal</p>
      </div>
    `,
        attachments: [
            {
                filename: 'cita.ics',
                content: buildICS({ patientName, dateTime, durationMinutes: 45 }),
            },
        ],
    });
}