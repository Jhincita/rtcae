import { NextRequest, NextResponse } from 'next/server';
import { FlowService } from '@/lib/flow/flow.service';
import { prisma } from '@/lib/prisma';
import { sendPaymentConfirmedEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        console.log('[Confirm] Raw body:', rawBody);
        const formData = new URLSearchParams(rawBody);
        const token = formData.get('token');
        if (!token) {
            return NextResponse.json({ error: 'missing token' }, { status: 400 });
        }

        const statusResp = await FlowService.getPaymentStatus(token);
        console.log('[Confirm] Status response:', JSON.stringify(statusResp));

        const isPaid = statusResp.success === true;
        if (!isPaid) {
            return NextResponse.json({ error: 'payment not successful' }, { status: 400 });
        }

        const payment = await prisma.payment.findUnique({
            where: { token },
            include: { appointment: { include: { client: true } } },
        });
        if (!payment) {
            return NextResponse.json({ error: 'payment record not found' }, { status: 404 });
        }

        if (payment.status === 'PAID') {
            return NextResponse.json({ ok: true, alreadyProcessed: true });
        }

        await prisma.$transaction([
            prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'PAID' },
            }),
            prisma.appointment.update({
                where: { id: payment.appointmentId },
                data: { status: 'CONFIRMED', paymentStatus: 'PAID', transactionId: token },
            }),
        ]);

        // Non-fatal — payment is confirmed regardless of email success
        try {
            const { client, dateTime } = payment.appointment;
            await sendPaymentConfirmedEmail({
                to: client.email,
                patientName: client.name,
                dateTime,
            });
        } catch (emailErr) {
            console.error('[Confirm] Email failed (non-fatal):', emailErr);
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[Confirm] Error:', error);
        return NextResponse.json({ error: 'internal error' }, { status: 500 });
    }
}