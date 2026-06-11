import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      name: 'Private Client',
      customerId: 'MRG-000001',
    },
  });

  await prisma.product.upsert({
    where: { slug: 'folded-tote' },
    update: {},
    create: {
      slug: 'folded-tote',
      name: 'Folded Tote',
      category: 'atelier-leather',
      description: 'A structured everyday tote in limited-run leather.',
      price: 120000,
      media: [],
    },
  });

  console.log(`Seeded Murgdur demo data for ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
