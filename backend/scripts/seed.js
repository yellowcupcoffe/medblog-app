require("dotenv").config({ path: "../.env" });
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");   // <— Works on all Node versions


const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("Seeding admin user...");

    const password = await bcrypt.hash("YourSuperStrongPass", 10);

    const admin = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        name: "Admin",
        email: "admin@example.com",
        password: password,
      },
    });

    console.log("Admin Created:", admin);
  } catch (err) {
    console.error("SEED ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
