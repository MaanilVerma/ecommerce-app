import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.category.deleteMany();

  const categories = Array.from({ length: 100 }, () => ({
    name: faker.commerce.productName(),
  }));

  for (const category of categories) {
    try {
      await prisma.category.create({
        data: category,
      });
    } catch (e: any) {
      if (e.code === "P2002") {
        // P2002 is the code for unique constraint violation
        console.log(`Skipping duplicate category: ${category.name}`);
      } else {
        throw e;
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
