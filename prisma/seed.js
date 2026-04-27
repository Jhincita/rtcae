// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const slots = [];
    // Monday to Friday (dayOfWeek 1..5)
    for (let day = 1; day <= 5; day++) {
        for (let hour = 9; hour <= 17; hour++) {
            if (hour === 13) continue; // skip lunch
            slots.push({
                dayOfWeek: day,
                startTime: `${hour.toString().padStart(2, '0')}:00`,
                endTime: `${hour.toString().padStart(2, '0')}:45`,
                isActive: true,
            });
        }
    }
    await prisma.availableSlot.createMany({ data: slots });
    console.log('✅ Slots seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });