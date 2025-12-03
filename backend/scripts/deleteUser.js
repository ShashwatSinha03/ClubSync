import dotenv from "dotenv";
dotenv.config();

import prisma from "../src/lib/prisma.js";

const email = process.argv[2];

if (!email) {
  console.error("❌ Usage: node scripts/deleteUser.js email@example.com");
  process.exit(1);
}

(async () => {
  try {
    const deleted = await prisma.user.delete({
      where: { email }
    });

    console.log("🗑️ Deleted:", deleted);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    process.exit(1);
  }
})();
