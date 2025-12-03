// node scripts/listAdmins.js
import dotenv from "dotenv";
dotenv.config();

import prisma from "../src/lib/prisma.js";

(async () => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "admin" },
      select: { id: true, name: true, email: true, approved: true, createdAt: true },
      orderBy: { createdAt: "desc" }
    });
    console.log("Admins:", admins);
    process.exit(0);
  } catch (err) {
    console.error("Error listing admins:", err);
    process.exit(1);
  }
})();
