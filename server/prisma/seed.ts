import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const electronics = await prisma.category.upsert({
    where: { name: "Electronics" },
    update: {},
    create: { name: "Electronics", description: "Gadgets and devices" },
  });

  const books = await prisma.category.upsert({
    where: { name: "Books" },
    update: {},
    create: { name: "Books", description: "Fiction and non-fiction books" },
  });

  await prisma.product.createMany({
    data: [
      {
        title: "Wireless Mouse",
        description: "Ergonomic wireless mouse",
        price: 19.99,
        stock: 50,
        categoryId: electronics.id,
      },
      {
        title: "Mechanical Keyboard",
        description: "RGB mechanical keyboard",
        price: 59.99,
        stock: 30,
        categoryId: electronics.id,
      },
      {
        title: "Clean Code",
        description: "A handbook of agile software craftsmanship",
        price: 34.99,
        stock: 20,
        categoryId: books.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete. Admin login -> email: admin@example.com password: Admin@123");
  console.log({ admin: admin.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
