'use server';
import { prisma } from '@/lib/prisma';

type Slot = {
    id: string;
    startTime: string;
    endTime: string;
};

function generateSlotId(date: Date, startTime: string): string {
    return `${date.toISOString().split('T')[0]}-${startTime}`;
}

function getFixedSlotsForDate(date: Date): Slot[] {
    const day = date.getDay(); // 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday
    if (day < 1 || day > 5) return []; // weekends

    // Slots from 13:00 to 17:00, every 45 min
    const startTimes = ['13:00', '13:45', '14:30', '15:15', '16:00', '16:15'];
    const endTimes   = ['13:45', '14:30', '15:15', '16:00', '16:45', '17:00'];

    return startTimes.map((start, idx) => ({
        id: generateSlotId(date, start),
        startTime: start,
        endTime: endTimes[idx],
    }));
}

export async function getAvailableSlots(date: Date): Promise<Slot[]> {
    // Clean up stale pending appointments older than 30 minutes
    await prisma.appointment.deleteMany({
        where: {
            status: 'PENDING',
            createdAt: { lt: new Date(Date.now() - 30 * 60 * 1000) },
        },
    });

    const allSlots = getFixedSlotsForDate(date);
    if (allSlots.length === 0) return [];

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const booked = await prisma.appointment.findMany({
        where: {
            dateTime: { gte: startOfDay, lt: endOfDay },
            status: { in: ['PENDING', 'CONFIRMED'] },
        },
        select: { dateTime: true },
    });

    const bookedStartTimes = booked.map(apt => {
        const h = apt.dateTime.getHours().toString().padStart(2, '0');
        const m = apt.dateTime.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
    });

    return allSlots.filter(slot => !bookedStartTimes.includes(slot.startTime));
}