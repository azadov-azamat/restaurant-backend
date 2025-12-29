"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            password: hashedPassword,
            name: "Administrator",
            role: client_1.UserRole.ADMIN,
        },
    });
    const managerPassword = await bcrypt.hash("manager123", 10);
    await prisma.user.upsert({
        where: { username: "manager" },
        update: {},
        create: {
            username: "manager",
            password: managerPassword,
            name: "Manager",
            role: client_1.UserRole.MANAGER,
        },
    });
    const chefPassword = await bcrypt.hash("chef123", 10);
    await prisma.user.upsert({
        where: { username: "chef" },
        update: {},
        create: {
            username: "chef",
            password: chefPassword,
            name: "Oshpaz",
            role: client_1.UserRole.CHEF,
        },
    });
    const waiterPassword = await bcrypt.hash("waiter123", 10);
    await prisma.user.upsert({
        where: { username: "waiter" },
        update: {},
        create: {
            username: "waiter",
            password: waiterPassword,
            name: "Ofitsiant",
            role: client_1.UserRole.WAITER,
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
//# sourceMappingURL=seed.js.map