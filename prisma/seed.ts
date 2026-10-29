import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "AL YOUNUS Administrator";
  if (!email || !password || password.length < 12) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in your local .env before seeding.");
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role: UserRole.ADMIN, active: true },
    create: { name, email, passwordHash, role: UserRole.ADMIN, active: true }
  });
  console.log("Admin account created/updated. Do not share the password or commit .env.");
}

main().finally(async () => prisma.$disconnect());
