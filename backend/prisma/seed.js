import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'ADMIN'
  },
  {
    name: 'Member User',
    email: 'member@test.com',
    password: 'member123',
    role: 'MEMBER'
  }
];

async function main() {
  for (const user of seedUsers) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } });

    if (!existing) {
      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: await bcrypt.hash(user.password, 12),
          role: user.role
        }
      });
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });