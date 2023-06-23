import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.role.createMany({
    data: [{ name: "Brand" }, { name: "Influencer" }, { name: "Individual" }],
  });

  const categories = await prisma.category.createMany({
    data: [
      { name: "Lifestyle" },
      { name: "Comedy" },
      { name: "Fashion" },
      { name: "Gamming" },
      { name: "Cannabis" },
    ],
  });

  const socialMedias = await prisma.socialMedia.createMany({
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

  console.log({ roles, categories, socialMedias });
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
