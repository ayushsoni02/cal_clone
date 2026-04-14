// backend/prisma/seed.ts
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Default user
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Alex Johnson',
      username: 'admin',
      email: 'alex@example.com',
    },
  });

  // Event Types
  const meeting30 = await prisma.eventType.upsert({
    where: { userId_slug: { userId: user.id, slug: '30min' } },
    update: {},
    create: {
      title: '30 Minute Meeting',
      description: 'A quick 30-minute sync to discuss anything you need.',
      duration: 30,
      slug: '30min',
      userId: user.id,
    },
  });

  await prisma.eventType.upsert({
    where: { userId_slug: { userId: user.id, slug: '60min' } },
    update: {},
    create: {
      title: '1 Hour Deep Dive',
      description: 'A focused 1-hour session for detailed discussions.',
      duration: 60,
      slug: '60min',
      userId: user.id,
    },
  });

  await prisma.eventType.upsert({
    where: { userId_slug: { userId: user.id, slug: '15min' } },
    update: {},
    create: {
      title: '15 Minute Intro Call',
      description: 'A short intro call to get to know each other.',
      duration: 15,
      slug: '15min',
      userId: user.id,
    },
  });

  // Availability (Mon–Fri, 9am–5pm IST)
  const workdays = [1, 2, 3, 4, 5];
  for (const day of workdays) {
    await prisma.availability.upsert({
      where: { id: day },
      update: {},
      create: {
        userId: user.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
        timezone: 'Asia/Kolkata',
      },
    });
  }

  // Sample bookings
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  await prisma.booking.create({
    data: {
      eventTypeId: meeting30.id,
      bookerName: 'Priya Sharma',
      bookerEmail: 'priya@example.com',
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 30 * 60000),
      status: 'upcoming',
    },
  });

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 2);
  pastDate.setHours(14, 0, 0, 0);

  await prisma.booking.create({
    data: {
      eventTypeId: meeting30.id,
      bookerName: 'Rahul Mehta',
      bookerEmail: 'rahul@example.com',
      startTime: pastDate,
      endTime: new Date(pastDate.getTime() + 30 * 60000),
      status: 'past',
    },
  });

  console.log('Seed complete.');
}

main().catch(console.error).finally(() => prisma.$disconnect());