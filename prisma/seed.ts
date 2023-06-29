import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [{ name: "Brand" }, { name: "Influencer" }, { name: "Individual" }],
  });

  await prisma.gender.createMany({
    data: [{ name: "Male" }, { name: "Female" }, { name: "Other" }],
  });

  await prisma.category.createMany({
    data: [
      { name: "Lifestyle" },
      { name: "Comedy" },
      { name: "Fashion" },
      { name: "Gamming" },
      { name: "Cannabis" },
    ],
  });

  await prisma.socialMedia.createMany({
    data: [
      { name: "Instagram" },
      { name: "Twitter" },
      { name: "TikTok" },
      { name: "YouTube" },
      { name: "Facebook" },
      { name: "Linkedin" },
      { name: "Pinterest" },
      { name: "Twitch" },
    ],
  });
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
