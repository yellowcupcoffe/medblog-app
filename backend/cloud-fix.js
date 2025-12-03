require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // 1. Verify we are talking to the Cloud
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ Error: DATABASE_URL is missing in .env");
    return;
  }
  
  console.log("🔌 Connecting to Database...");
  if (dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1")) {
    console.warn("⚠️  WARNING: You are connected to LOCALHOST. This won't fix the Live site!");
  } else if (dbUrl.includes("neon.tech")) {
    console.log("✅ GREAT! Connected to NEON CLOUD Database.");
  }

  // 2. Wipe and Re-create Admin
  const email = "admin@example.com";
  const password = "password123"; // Simple password for now
  
  console.log(`\n🔄 Resetting user: ${email}...`);

  // Delete existing to avoid conflicts
  await prisma.user.deleteMany({ where: { email } });

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new
  await prisma.user.create({
    data: {
      email,
      name: "Admin",
      password: hashedPassword,
    },
  });

  console.log("\n✅ SUCCESS! Cloud Admin Reset.");
  console.log("------------------------------------------------");
  console.log("📧 Email:    " + email);
  console.log("🔑 Password: " + password);
  console.log("------------------------------------------------");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());