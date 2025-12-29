import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Administrator",
      role: UserRole.ADMIN,
    },
  });

  // Create default manager
  const managerPassword = await bcrypt.hash("manager123", 10);
  await prisma.user.upsert({
    where: { username: "manager" },
    update: {},
    create: {
      username: "manager",
      password: managerPassword,
      name: "Manager",
      role: UserRole.MANAGER,
    },
  });

  // Create default chef
  const chefPassword = await bcrypt.hash("chef123", 10);
  await prisma.user.upsert({
    where: { username: "chef" },
    update: {},
    create: {
      username: "chef",
      password: chefPassword,
      name: "Oshpaz",
      role: UserRole.CHEF,
    },
  });

  // Create default waiter
  const waiterPassword = await bcrypt.hash("waiter123", 10);
  await prisma.user.upsert({
    where: { username: "waiter" },
    update: {},
    create: {
      username: "waiter",
      password: waiterPassword,
      name: "Ofitsiant",
      role: UserRole.WAITER,
    },
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
