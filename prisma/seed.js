require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const data = require('./mock-data.json');
const prisma = new PrismaClient();

const main = async () => {
  const clerkId = process.env.NEXT_PUBLIC_CLERK_USER_ID;
  if (!clerkId) {
    console.error(
      'Fout: NEXT_PUBLIC_CLERK_USER_ID niet gevonden in .env.local'
    );
    return;
  }

  for (const job of data) {
    await prisma.job.create({
      data: {
        position: job.position,
        company: job.company,
        location: job.location,
        status: job.status,
        mode: job.mode,
        description: job.description,
        clerkId: clerkId,

        createdAt: new Date(job.createdAt),
      },
    });
  }
  console.log('Seed succesvol: Jobs zijn toegevoegd!');
};
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
