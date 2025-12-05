const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const email = process.argv[2];

if (!email) {
  console.log('Usage: node src/scripts/makeAdmin.js <email>');
  process.exit(1);
}

async function main() {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      console.log(`User with email ${email} not found.`);
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    
    console.log(`Success! User ${updatedUser.email} is now an ADMIN.`);
  } catch (e) {
    console.error('Error updating user:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
