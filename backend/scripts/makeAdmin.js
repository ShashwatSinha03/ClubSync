// Run as: node scripts/makeAdmin.js <email>

import dotenv from "dotenv";
dotenv.config();

import prisma from "../src/lib/prisma.js";

const email = process.argv[2];

if (!email) {
  console.log("❌ Please provide an email");
  console.log("Usage: node scripts/makeAdmin.js user@example.com");
  process.exit(1);
}

async function makeAdmin() {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "admin", approved: true },
    });

    console.log("✅ User promoted to admin successfully:");
    console.log(user);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

makeAdmin();
