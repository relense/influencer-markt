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
      { name: "Fashion" },
      { name: "Gaming" },
      { name: "Cannabis" },
      { name: "Beauty" },
      { name: "Travel" },
      { name: "Health" },
      { name: "Food" },
      { name: "Model" },
      { name: "Comedy" },
      { name: "Art" },
      { name: "Music" },
      { name: "Entrepreuneur" },
      { name: "Family & Children" },
      { name: "Animals" },
      { name: "Athlete" },
      { name: "Adventure" },
      { name: "Education" },
      { name: "Celebrity" },
      { name: "Technology" },
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

  await prisma.user.createMany({
    data: [
      {
        email: "nike@gmail.com",
        firstSteps: true,
        roleId: 1,
        username: "nike",
      },
      {
        email: "cocacola@gmail.com",
        firstSteps: true,
        roleId: 1,
        username: "cocaCola",
      },
      {
        email: "apple@gmail.com",
        firstSteps: true,
        roleId: 1,
        username: "apple",
      },
      {
        email: "lg@gmail.com",
        firstSteps: true,
        roleId: 1,
        username: "LG",
      },
      {
        email: "oliveraTomas@gmail.com",
        firstSteps: true,
        roleId: 2,
        username: "tomasOliveira",
      },
      {
        email: "andreGomes@gmail.com",
        firstSteps: true,
        roleId: 2,
        username: "andreGomes",
      },
      {
        email: "andreiaSofia@gmail.com",
        firstSteps: true,
        roleId: 2,
        username: "andreiaSofia",
      },
      {
        email: "inesguerreiro@gmail.com",
        firstSteps: true,
        roleId: 2,
        username: "inesGuerreiro",
      },
    ],
  });

  const users = await prisma.user.findMany({});

  await prisma.profile.createMany({
    data: [
      {
        about:
          "Nike, the iconic sportswear brand, revolutionizes athletic performance with innovation. From cutting-edge footwear to high-performance apparel, Nike empowers athletes worldwide. With a rich history of inspiring athletes, the brand's relentless pursuit of excellence drives them forward. Fuel your passion with Nike's dynamic range of products and experience the embodiment of sport and style. Elevate your game and unleash your true ",
        city: "Portugal",
        country: "Lisboa",
        name: "Nike",
        profilePicture:
          "https://images.unsplash.com/photo-1608541737042-87a12275d313?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1722&q=80",
        userId: users[0]?.id || "",
        website: "https://www.nike.com/pt/en/",
      },
      {
        about:
          "Coca-Cola, the beloved beverage brand, quenches thirst with its iconic refreshment. For over a century, Coca-Cola has delighted taste buds with its signature fizzy and timeless flavor. From its classic cola to a wide range of refreshing drinks, Coca-Cola brings people together, sparking moments of happiness and celebration. With every sip, experience the effervescent joy that Coca-Cola brings. Let the bubbly ",
        city: "Portugal",
        country: "Lisboa",
        name: "Coca Cola",
        profilePicture:
          "https://images.unsplash.com/photo-1535990379313-5cd271a2da2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
        userId: users[1]?.id || "",
        website: "https://www.cocacolaportugal.pt/",
      },
      {
        about:
          "Apple, the innovative tech giant, revolutionizes the way we live, work, and connect. With its sleek and cutting-edge products, Apple has redefined the world of technology. From the iconic iPhone to the powerful Mac computers and the versatile iPad, Apple devices empower users to create, communicate, and explore like never before. With a seamless integration of hardware and software, Apple",
        city: "California, San Antonio",
        country: "USA",
        name: "Apple",
        profilePicture:
          "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        userId: users[2]?.id || "",
        website: "https://www.apple.com/pt/",
      },
      {
        about:
          "LG, a leading global technology company, brings innovation and convenience to your everyday life. With a diverse range of products, LG offers cutting-edge solutions that enhance your home, work, and entertainment experiences. From state-of-the-art televisions and home appliances to advanced mobile devices and cutting-edge audio systems, LG combines sleek design with exceptional performance. Immerse yourself in vibrant visuals",
        city: "Seoul",
        country: "South Korea",
        name: "LG",
        profilePicture:
          "https://images.unsplash.com/photo-1590664177914-9da6d6e8f0f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        userId: users[3]?.id || "",
        website: "https://www.lg.com/pt",
      },
      {
        about:
          "Tomas Oliveira, a charismatic adventurer with a passion for exploration. Born with wanderlust in his veins, he seeks thrill and beauty in every corner of the world. From climbing majestic mountains to diving into deep oceans, he embraces the unknown. With a heart full of curiosity, Tomas unravels diverse cultures, tasting exotic cuisines, and connecting with people from all walks of life. Through his travels, he's ",
        city: "Barcelona",
        country: "Spain",
        name: "Tomas Oliveira",
        profilePicture:
          "https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        userId: users[4]?.id || "",
        genderId: 1,
        website: "",
      },
      {
        about:
          "Andre Gomes, a charismatic adventurer with a passion for exploration. Born with wanderlust in his veins, he seeks thrill and beauty in every corner of the world. From climbing majestic mountains to diving into deep oceans, he embraces the unknown. With a heart full of curiosity, Tomas unravels diverse cultures, tasting exotic cuisines, and connecting with people from all walks of life. Through his travels, he's ",
        city: "Portugal",
        country: "Lisboa",
        name: "Andre Gomes",
        profilePicture:
          "https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80",
        userId: users[5]?.id || "",
        genderId: 1,
        website: "",
      },
      {
        about:
          "Andreia Sofia, a charismatic adventurer with a passion for exploration. Born with wanderlust in his veins, he seeks thrill and beauty in every corner of the world. From climbing majestic mountains to diving into deep oceans, he embraces the unknown. With a heart full of curiosity, Tomas unravels diverse cultures, tasting exotic cuisines, and connecting with people from all walks of life. Through his travels, he's ",
        city: "Portugal",
        country: "Porto",
        name: "Andreia Sofia",
        profilePicture:
          "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80",
        userId: users[6]?.id || "",
        genderId: 2,
        website: "",
      },
      {
        about:
          "Ines Guerreiro, a charismatic adventurer with a passion for exploration. Born with wanderlust in his veins, he seeks thrill and beauty in every corner of the world. From climbing majestic mountains to diving into deep oceans, he embraces the unknown. With a heart full of curiosity, Tomas unravels diverse cultures, tasting exotic cuisines, and connecting with people from all walks of life. Through his travels, he's ",
        city: "Portugal",
        country: "Setubal",
        name: "Ines Guerreiro",
        profilePicture:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=922&q=80",
        userId: users[7]?.id || "",
        genderId: 2,
        website: "",
      },
    ],
  });

  await prisma.profile.findMany({});

  await prisma.userSocialMedia.createMany({
    data: [
      {
        followers: 2000,
        handler: "luky",
        socialMediaId: 1,
        url: "",
        profileId: 1,
      },
      {
        followers: 2000,
        handler: "luky",
        socialMediaId: 2,
        url: "",
        profileId: 1,
      },
      {
        followers: 2000,
        handler: "luky",
        socialMediaId: 1,
        url: "",
        profileId: 2,
      },
      {
        followers: 2000,
        handler: "luky",
        socialMediaId: 2,
        url: "",
        profileId: 2,
      },
      {
        followers: 2000,
        handler: "luky",
        socialMediaId: 1,
        url: "",
        profileId: 3,
      },
      {
        followers: 2000,
        handler: "luky",
        socialMediaId: 2,
        url: "",
        profileId: 3,
      },
      {
        followers: 2000,
        handler: "luky",
        socialMediaId: 1,
        url: "",
        profileId: 4,
      },
      {
        followers: 2000,
        handler: "luky",
        socialMediaId: 2,
        url: "",
        profileId: 4,
      },
      {
        followers: 2000,
        handler: "luky",
        socialMediaId: 1,
        url: "",
        profileId: 5,
      },
      {
        followers: 2000,
        handler: "luky",
        socialMediaId: 2,
        url: "",
        profileId: 5,
      },
      {
        followers: 2000,
        handler: "luky",
        socialMediaId: 1,
        url: "",
        profileId: 6,
      },
      {
        followers: 2000,
        handler: "luky",
        socialMediaId: 2,
        url: "",
        profileId: 6,
      },
      {
        followers: 2000,
        handler: "luky",
        socialMediaId: 1,
        url: "",
        profileId: 7,
      },
      {
        followers: 2000,
        handler: "luky",
        socialMediaId: 2,
        url: "",
        profileId: 7,
      },
      {
        followers: 2000,
        handler: "luky",
        socialMediaId: 1,
        url: "",
        profileId: 8,
      },
      {
        followers: 2000,
        handler: "luky",
        socialMediaId: 2,
        url: "",
        profileId: 8,
      },
    ],
  });

  await prisma.valuePack.createMany({
    data: [
      {
        deliveryTime: 1,
        description: "super value pack 1 post and 2 stories",
        numberOfRevisions: 2,
        socialMediaId: 1,
        title: "super value",
        valuePackPrice: 1000,
        profileId: 5,
      },
      {
        deliveryTime: 2,
        description: "Mega value pack with 2 stories",
        numberOfRevisions: 2,
        socialMediaId: 1,
        title: "Mega Pack",
        valuePackPrice: 1000,
        profileId: 5,
      },
      {
        deliveryTime: 1,
        description: "super value pack 1 post and 2 stories",
        numberOfRevisions: 2,
        socialMediaId: 1,
        title: "super value",
        valuePackPrice: 1000,
        profileId: 6,
      },
      {
        deliveryTime: 2,
        description: "Mega value pack with 2 stories",
        numberOfRevisions: 2,
        socialMediaId: 1,
        title: "Mega Pack",
        valuePackPrice: 1000,
        profileId: 6,
      },
      {
        deliveryTime: 1,
        description: "super value pack 1 post and 2 stories",
        numberOfRevisions: 2,
        socialMediaId: 1,
        title: "super value",
        valuePackPrice: 1000,
        profileId: 7,
      },
      {
        deliveryTime: 2,
        description: "Mega value pack with 2 stories",
        numberOfRevisions: 2,
        socialMediaId: 1,
        title: "Mega Pack",
        valuePackPrice: 1000,
        profileId: 7,
      },
      {
        deliveryTime: 1,
        description: "super value pack 1 post and 2 stories",
        numberOfRevisions: 2,
        socialMediaId: 1,
        title: "super value",
        valuePackPrice: 1000,
        profileId: 8,
      },
      {
        deliveryTime: 2,
        description: "Mega value pack with 2 stories",
        numberOfRevisions: 2,
        socialMediaId: 1,
        title: "Mega Pack",
        valuePackPrice: 1000,
        profileId: 8,
      },
    ],
  });

  await prisma.portfolio.createMany({
    data: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        profileId: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1790&q=80",
        profileId: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1589423045402-6074a1bdf723?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=902&q=80",
        profileId: 2,
      },
      {
        url: "https://images.unsplash.com/photo-1561758033-48d52648ae8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        profileId: 2,
      },
      {
        url: "https://images.unsplash.com/photo-1530018352490-c6eef07fd7e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=836&q=80",
        profileId: 3,
      },
      {
        url: "https://images.unsplash.com/photo-1587071292164-aa5ab1c8c706?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        profileId: 3,
      },
      {
        url: "https://images.unsplash.com/flagged/photo-1572609239482-d3a83f976aa0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
        profileId: 4,
      },
      {
        url: "https://images.unsplash.com/photo-1613280194169-6bb2f32a6bfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80",
        profileId: 4,
      },
      {
        url: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        profileId: 5,
      },
      {
        url: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        profileId: 6,
      },
      {
        url: "https://images.unsplash.com/photo-1521566652839-697aa473761a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80",
        profileId: 7,
      },
      {
        url: "https://images.unsplash.com/photo-1465429167186-266ef03d6277?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
        profileId: 8,
      },
    ],
  });

  await prisma.review.createMany({
    data: [
      {
        date: new Date(),
        rating: 4,
        authorId: 1,
        userReview: "Really awesome job and I am very happy",
        profileReviewdId: 5,
      },
      {
        date: new Date(),
        rating: 5,
        authorId: 2,
        userReview:
          "Best influencer I ever hired! Thank you so much and very recommended",
        profileReviewdId: 5,
      },
      {
        date: new Date(),
        rating: 5,
        authorId: 3,
        userReview: "Vwey cool and I am really happy with the result.",
        profileReviewdId: 5,
      },
      {
        date: new Date(),
        rating: 5,
        authorId: 3,
        userReview: "I will send double the review because I am really happy",
        profileReviewdId: 5,
      },
      {
        date: new Date(),
        rating: 4,
        authorId: 4,
        userReview: "It was a nice job done by this person",
        profileReviewdId: 5,
      },
      {
        date: new Date(),
        rating: 4,
        authorId: 1,
        userReview: "Really awesome job and I am very happy",
        profileReviewdId: 6,
      },
      {
        date: new Date(),
        rating: 5,
        authorId: 2,
        userReview:
          "Best influencer I ever hired! Thank you so much and very recommended",
        profileReviewdId: 6,
      },
      {
        date: new Date(),
        rating: 5,
        authorId: 3,
        userReview: "Vwey cool and I am really happy with the result.",
        profileReviewdId: 6,
      },
      {
        date: new Date(),
        rating: 5,
        authorId: 3,
        userReview: "I will send double the review because I am really happy",
        profileReviewdId: 6,
      },
      {
        date: new Date(),
        rating: 4,
        authorId: 4,
        userReview: "It was a nice job done by this person",
        profileReviewdId: 6,
      },
      {
        date: new Date(),
        rating: 4,
        authorId: 1,
        userReview: "Really awesome job and I am very happy",
        profileReviewdId: 7,
      },
      {
        date: new Date(),
        rating: 5,
        authorId: 2,
        userReview:
          "Best influencer I ever hired! Thank you so much and very recommended",
        profileReviewdId: 7,
      },
      {
        date: new Date(),
        rating: 5,
        authorId: 3,
        userReview: "Vwey cool and I am really happy with the result.",
        profileReviewdId: 7,
      },
      {
        date: new Date(),
        rating: 5,
        authorId: 3,
        userReview: "I will send double the review because I am really happy",
        profileReviewdId: 7,
      },
      {
        date: new Date(),
        rating: 4,
        authorId: 4,
        userReview: "It was a nice job done by this person",
        profileReviewdId: 7,
      },
      {
        date: new Date(),
        rating: 4,
        authorId: 1,
        userReview: "Really awesome job and I am very happy",
        profileReviewdId: 8,
      },
      {
        date: new Date(),
        rating: 5,
        authorId: 2,
        userReview:
          "Best influencer I ever hired! Thank you so much and very recommended",
        profileReviewdId: 8,
      },
      {
        date: new Date(),
        rating: 5,
        authorId: 3,
        userReview: "Vwey cool and I am really happy with the result.",
        profileReviewdId: 8,
      },
      {
        date: new Date(),
        rating: 5,
        authorId: 3,
        userReview: "I will send double the review because I am really happy",
        profileReviewdId: 8,
      },
      {
        date: new Date(),
        rating: 4,
        authorId: 4,
        userReview: "It was a nice job done by this person",
        profileReviewdId: 8,
      },
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
