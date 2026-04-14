// app/api/clients/route.ts
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

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

        const client = await prisma.client.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                problemStatus: body.problemStatus,
                urgent: body.urgent || false,
            }
        })

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

// GET endpoint igual (no necesita cambios)
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