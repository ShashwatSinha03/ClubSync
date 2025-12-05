const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('--- ALL USERS ---');
    users.forEach(user => {
      console.log(`${user.email} - Role: ${user.role}`);
    });
    console.log('-----------------');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
