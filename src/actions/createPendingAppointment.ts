'use server';
import { prisma } from '@/lib/prisma';
import { FlowService } from '@/lib/flow/flow.service';

function getBaseUrl(): string {
    if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
}

export async function createPendingAppointment(input: {
    clientId: string;
    selectedDate: Date;
    slotStartTime: string;
    slotEndTime: string;
}) {
    try {
        const client = await prisma.client.findUnique({ where: { id: input.clientId } });
        if (!client) return { success: false, error: 'Cliente no encontrado' };

        const [hour, minute] = input.slotStartTime.split(':').map(Number);
        const dateTime = new Date(input.selectedDate);
        dateTime.setHours(hour, minute, 0, 0);

        const duration = 25;
        const amount = 25000;

        const appointment = await prisma.appointment.create({
            data: {
                clientId: input.clientId,
                dateTime,
                duration,
                status: 'PENDING',
                paymentStatus: 'PENDING',
                amount,
            },
        });

        const baseUrl = getBaseUrl();
        const confirmUrl = `${baseUrl}/api/payments/flow/confirm`;
        const returnUrl = `${baseUrl}/api/payments/flow/return?appointmentId=${appointment.id}`;

        console.log('[createPendingAppointment] FLOW_API_KEY exists?', !!process.env.FLOW_API_KEY);
        console.log('[createPendingAppointment] FLOW_SECRET_KEY exists?', !!process.env.FLOW_SECRET_KEY);
        console.log('[createPendingAppointment] FLOW_ENVIRONMENT:', process.env.FLOW_ENVIRONMENT);
        console.log('[createPendingAppointment] confirmUrl:', confirmUrl);
        console.log('[createPendingAppointment] returnUrl:', returnUrl);

        const flowRes = await FlowService.createOrder({
            amount,
            email: client.email,
            subject: `Asesoría legal - ${client.name}`,
            urlConfirmation: confirmUrl,
            urlReturn: returnUrl,
        });

        if (!flowRes.success) {
            await prisma.appointment.delete({ where: { id: appointment.id } });
            return { success: false, error: flowRes.error || 'Error al iniciar pago' };
        }

        await prisma.payment.create({
            data: {
                appointmentId: appointment.id,
                buyOrder: `RES-${Date.now()}`,
                amount,
                status: 'PENDING',
                token: flowRes.token,
            },
        });

        return { success: true, paymentUrl: flowRes.url };
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error interno';
        console.error(err);
        return { success: false, error: errorMessage };
    }
}