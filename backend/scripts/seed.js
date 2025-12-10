const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";
  
  // Look for password in .env, or fallback to a placeholder (safe for public code)
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!"; 

  console.log(`🌱 Seeding admin user...`);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email: email },
    update: {}, 
    create: {
      email: email,
      name: "Admin",
      password: hashedPassword,
    },
  });

  console.log(`✅ Admin ready: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });