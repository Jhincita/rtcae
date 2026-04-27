import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function getBaseUrl(): string {
    if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
}

export async function POST(req: NextRequest) {
    const baseUrl = getBaseUrl();
    try {
        const rawBody = await req.text();
        console.log('[Return POST] Raw body:', rawBody);
        const formData = new URLSearchParams(rawBody);
        const token = formData.get('token');
        console.log('[Return POST] Token:', token);

        if (!token) {
            return NextResponse.redirect(new URL('/payment/error', baseUrl));
        }

        // Find payment by token — confirm webhook should have already updated it
        const payment = await prisma.payment.findUnique({
            where: { token },
            include: { appointment: true },
        });

        console.log('[Return POST] Payment status:', payment?.status);
        console.log('[Return POST] Appointment paymentStatus:', payment?.appointment?.paymentStatus);

        if (payment?.status === 'PAID') {
            return NextResponse.redirect(
                new URL(`/payment/success?appointmentId=${payment.appointmentId}`, baseUrl)
            );
        }

        // Confirm webhook may not have fired yet (async payment methods)
        // Fall back to checking Flow directly
        const { FlowService } = await import('@/lib/flow/flow.service');
        const statusResp = await FlowService.getPaymentStatus(token);
        console.log('[Return POST] Flow status fallback:', JSON.stringify(statusResp));

        if (statusResp.success === true && payment) {
            // Update DB since confirm webhook hasn't fired yet
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
            return NextResponse.redirect(
                new URL(`/payment/success?appointmentId=${payment.appointmentId}`, baseUrl)
            );
        }

        return NextResponse.redirect(new URL('/payment/error', baseUrl));
    } catch (error) {
        console.error('[Return POST] Error:', error);
        return NextResponse.redirect(new URL('/payment/error', baseUrl));
    }
}

export async function GET(req: NextRequest) {
    const baseUrl = getBaseUrl();
    try {
        const appointmentId = req.nextUrl.searchParams.get('appointmentId');
        console.log('[Return GET] appointmentId:', appointmentId);

        if (!appointmentId) {
            return NextResponse.redirect(new URL('/payment/error', baseUrl));
        }

        // Look up the payment token from DB
        const payment = await prisma.payment.findFirst({
            where: { appointmentId },
            orderBy: { createdAt: 'desc' },
        });
        console.log('[Return GET] Found payment token:', payment?.token);
        console.log('[Return GET] Payment status:', payment?.status);

        // If confirm webhook already processed it
        if (payment?.status === 'PAID') {
            return NextResponse.redirect(
                new URL(`/payment/success?appointmentId=${appointmentId}`, baseUrl)
            );
        }

        // Webhook hasn't fired yet — ask Flow directly
        if (payment?.token) {
            const { FlowService } = await import('@/lib/flow/flow.service');
            const statusResp = await FlowService.getPaymentStatus(payment.token);
            console.log('[Return GET] Flow status:', JSON.stringify(statusResp));

            if (statusResp.success === true) {
                await prisma.$transaction([
                    prisma.payment.update({
                        where: { id: payment.id },
                        data: { status: 'PAID' },
                    }),
                    prisma.appointment.update({
                        where: { id: appointmentId },
                        data: { status: 'CONFIRMED', paymentStatus: 'PAID', transactionId: payment.token },
                    }),
                ]);
                return NextResponse.redirect(
                    new URL(`/payment/success?appointmentId=${appointmentId}`, baseUrl)
                );
            }
        }

        return NextResponse.redirect(new URL('/payment/error', baseUrl));
    } catch (error) {
        console.error('[Return GET] Error:', error);
        return NextResponse.redirect(new URL('/payment/error', baseUrl));
    }
}