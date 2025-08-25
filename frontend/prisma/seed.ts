
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'sidsundram@gmail.com',
      passwordHash: '123456789', // Use bcrypt in real apps
      role: 'USER',
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());