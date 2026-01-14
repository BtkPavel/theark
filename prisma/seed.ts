import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      login: "theark",
      password: "thearkHP",  // Здесь используем plain текст, в реальном проекте нужно хешировать пароль
    },
  });

  console.log("User created with login 'theark' and password 'thearkHP'");
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  });
