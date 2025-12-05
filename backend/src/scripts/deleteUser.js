const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const email = process.argv[2];

if (!email) {
  console.log('Usage: node src/scripts/deleteUser.js <email>');
  process.exit(1);
}

async function main() {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      console.log(`User with email ${email} not found.`);
      return;
    }

    await prisma.user.delete({ where: { email } });
    console.log(`Success! User ${email} deleted.`);
  } catch (e) {
    console.error('Error deleting user:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
