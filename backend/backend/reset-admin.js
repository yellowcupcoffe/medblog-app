const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log("🔥 Deleting old users...");
  await prisma.user.deleteMany({}); // Wipes all users

  console.log("🌱 Creating new admin...");
  const hashedPassword = await bcrypt.hash("password123", 10); // Simple pass for testing

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin",
      password: hashedPassword,
    },
  });

  console.log("✅ SUCCESS! Login with:");
  console.log("Email: admin@example.com");
  console.log("Pass:  password123");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());