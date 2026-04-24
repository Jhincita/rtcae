// app/api/clients/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const requiredFields = ['name', 'email', 'phone', 'problemStatus']
        const missingFields = requiredFields.filter(field => !body[field])

        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Missing required fields: ${missingFields.join(', ')}`
                },
                { status: 400 }
            )
        }

        // 1. Save to database
        const client = await prisma.client.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                problemStatus: body.problemStatus,
                urgent: body.urgent || false,
            }
        })

        // 2. Send email notification to site owners (non‑blocking)
        try {
            await resend.emails.send({
                from: process.env.EMAIL_FROM!,
                to: process.env.EMAIL_TO!,
                subject: `Nuevo cliente: ${body.name}`,
                html: `
                    <h2>Nuevo formulario de contacto</h2>
                    <p><strong>Nombre:</strong> ${body.name}</p>
                    <p><strong>Email:</strong> ${body.email}</p>
                    <p><strong>Teléfono:</strong> ${body.phone}</p>
                    <p><strong>Estado del problema:</strong> ${body.problemStatus}</p>
                    <p><strong>ID en sistema:</strong> ${client.id}</p>
                    <hr />
                    <p>Responder a: ${body.email}</p>
                `,
            })
        } catch (emailError) {
            // Log email error but don't fail the whole request
            console.error('Failed to send email notification:', emailError)
        }

        return NextResponse.json({
            success: true,
            client: {
                id: client.id,
                name: client.name,
                email: client.email,
                phone: client.phone,
                problemStatus: client.problemStatus
            }
        })

    } catch (error) {
        console.error('Error creating client:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to save client information'
            },
            { status: 500 }
        )
    }
}

// GET endpoint – unchanged
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (id) {
            const client = await prisma.client.findUnique({
                where: { id }
            })

            if (!client) {
                return NextResponse.json(
                    { success: false, error: 'Client not found' },
                    { status: 404 }
                )
            }

            return NextResponse.json({ success: true, client })
        }

        const clients = await prisma.client.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ success: true, clients })

    } catch (error) {
        console.error('Error fetching clients:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch clients' },
            { status: 500 }
        )
    }
}