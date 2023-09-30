/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type City = {
  id: string;
  name: string;
};

type State = {
  id: string;
  name: string;
  cities: City[];
};

type Country = {
  id: string;
  name: string;
  states: State[];
};

type Data = {
  countries: Country[];
};

async function main() {
  const response = await fetch(
    "https://publicdevinfmarkt.blob.core.windows.net/dev-inf-market-json-files/portugalStateCities.json"
  );
  const data: Data = await response.json();

  for (const country of data.countries) {
    const currentCountry = await prisma.country.create({
      data: {
        name: country.name,
      },
    });

    for (const state of country.states) {
      const currentState = await prisma.state.create({
        data: {
          name: state.name,
          country: {
            connect: {
              id: currentCountry.id,
            },
          },
        },
      });

      for (const city of state.cities) {
        await prisma.city.create({
          data: {
            name: city.name,
            state: {
              connect: {
                id: currentState.id,
              },
            },
          },
        });
      }
    }
  }

  await prisma.role.createMany({
    data: [{ name: "Brand" }, { name: "Influencer" }],
  });

  await prisma.gender.createMany({
    data: [{ name: "Male" }, { name: "Female" }, { name: "Other" }],
  });

  await prisma.jobStatus.createMany({
    data: [{ name: "open" }, { name: "progress" }, { name: "closed" }],
  });

  await prisma.orderStatus.createMany({
    data: [
      { name: "awaiting" },
      { name: "rejected" },
      { name: "accepted" },
      { name: "progress" },
      { name: "delivered" },
      { name: "confirmed" },
      { name: "canceled" },
      { name: "reviewed" },
      { name: "inDispute" },
    ],
  });

  await prisma.notificationStatus.createMany({
    data: [{ name: "toRead" }, { name: "read" }, { name: "hidden" }],
  });

  await prisma.notificationType.createMany({
    data: [
      { entityType: "sales", entityAction: "awaitingReply" },
      { entityType: "orders", entityAction: "rejected" },
      { entityType: "orders", entityAction: "accepted" },
      { entityType: "orders", entityAction: "delivered" },
      { entityType: "sales", entityAction: "canceled" },
      { entityType: "orders", entityAction: "canceled" },
      { entityType: "sales", entityAction: "paymentAdded" },
      { entityType: "sales", entityAction: "confirmed" },
      { entityType: "sales", entityAction: "reviewed" },
      { entityType: "sales", entityAction: "deliveryDateUpdate" },
      { entityType: "sales", entityAction: "inDispute" },
    ],
  });

  await prisma.reason.createMany({
    data: [
      { name: "Feedback" },
      { name: "General Question" },
      { name: "Other" },
    ],
  });

  await prisma.contactMessageState.createMany({
    data: [{ name: "open" }, { name: "progress" }, { name: "closed" }],
  });

  await prisma.verifiedStatus.createMany({
    data: [
      { name: "notVerified" },
      { name: "verified" },
      { name: "needsReverification" },
    ],
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
      { name: "Family" },
      { name: "Animals" },
      { name: "Athlete" },
      { name: "Adventure" },
      { name: "Education" },
      { name: "Celebrity" },
      { name: "Technology" },
    ],
  });

  await prisma.contentType.createMany({
    data: [
      { name: "post" }, //1
      { name: "story" }, //2
      { name: "reel" }, //3
      { name: "igtv" }, //4
      { name: "liveStream" }, //5
      { name: "video" }, //6
      { name: "sponsoredVideo" }, //7
      { name: "productPlacement" }, //8
      { name: "short" }, //9
      { name: "challenge" }, //10
      { name: "duets" }, //11
      { name: "hashtagCampaigns" }, //12
      { name: "brandedEffects" }, //13
      { name: "shoutout" }, //14
      { name: "sponsoredStream" }, //15
      { name: "endorsement" }, //16
      { name: "sponsoredGameplay" }, //17
      { name: "paidProductUnboxing" }, //18
      { name: "channelSponsorship" }, //19
      { name: "brandedChannelPanels" }, //20
      { name: "brandedLogoStreamOverlays" }, //21
      { name: "tweet" }, //22
      { name: "retweet" }, //23
      { name: "thread" }, //24
      { name: "repliesAndConversation" }, //25
      { name: "sponsoredEpisode" }, //26
      { name: "advertisement" }, //27
      { name: "sponsoredPins" }, //28
      { name: "diyTutorials" }, //29
      { name: "live" }, //30
      { name: "article" }, //31
    ],
  });

  //Instagram
  await prisma.socialMedia.create({
    data: {
      name: "Instagram",
      contentTypes: {
        connect: [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
          { id: 14 },
        ],
      },
    },
  });

  //YouTube
  await prisma.socialMedia.create({
    data: {
      name: "Youtube",
      contentTypes: {
        connect: [{ id: 6 }, { id: 7 }, { id: 8 }, { id: 14 }, { id: 9 }],
      },
    },
  });

  //Facebook
  await prisma.socialMedia.create({
    data: {
      name: "Facebook",
      contentTypes: {
        connect: [{ id: 1 }, { id: 5 }, { id: 2 }, { id: 14 }],
      },
    },
  });

  //TikTok
  await prisma.socialMedia.create({
    data: {
      name: "TikTok",
      contentTypes: {
        connect: [
          { id: 6 },
          { id: 10 },
          { id: 11 },
          { id: 12 },
          { id: 13 },
          { id: 5 },
          { id: 14 },
        ],
      },
    },
  });

  //Linkedin
  await prisma.socialMedia.create({
    data: {
      name: "Linkedin",
      contentTypes: {
        connect: [{ id: 31 }, { id: 1 }, { id: 5 }, { id: 2 }, { id: 14 }],
      },
    },
  });

  //Twitch
  await prisma.socialMedia.create({
    data: {
      name: "Twitch",
      contentTypes: {
        connect: [
          { id: 5 },
          { id: 15 },
          { id: 8 },
          { id: 16 },
          { id: 17 },
          { id: 18 },
          { id: 19 },
          { id: 20 },
          { id: 21 },
          { id: 14 },
        ],
      },
    },
  });

  //Twitter
  await prisma.socialMedia.create({
    data: {
      name: "X",
      contentTypes: {
        connect: [{ id: 22 }, { id: 23 }, { id: 24 }, { id: 25 }, { id: 14 }],
      },
    },
  });

  //Podcast
  await prisma.socialMedia.create({
    data: {
      name: "Podcast",
      contentTypes: {
        connect: [{ id: 26 }, { id: 27 }, { id: 8 }, { id: 14 }],
      },
    },
  });

  //Pinterest
  await prisma.socialMedia.create({
    data: {
      name: "Pinterest",
      contentTypes: {
        connect: [{ id: 28 }, { id: 29 }, { id: 14 }],
      },
    },
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
        cityId: 3,
        countryId: 1,
        name: "Nike",
        profilePicture:
          "https://images.unsplash.com/photo-1608541737042-87a12275d313?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1722&q=80",
        profilePictureBlobName: "exampleBlob",
        nif: "1234567",
        userId: users[0]?.id || "",
        website: "https://www.nike.com/pt/en/",
        verifiedStatusId: 1,
      },
      {
        about:
          "Coca-Cola, the beloved beverage brand, quenches thirst with its iconic refreshment. For over a century, Coca-Cola has delighted taste buds with its signature fizzy and timeless flavor. From its classic cola to a wide range of refreshing drinks, Coca-Cola brings people together, sparking moments of happiness and celebration. With every sip, experience the effervescent joy that Coca-Cola brings. Let the bubbly ",
        cityId: 3,
        countryId: 1,
        name: "Coca Cola",
        profilePicture:
          "https://images.unsplash.com/photo-1535990379313-5cd271a2da2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
        profilePictureBlobName: "exampleBlob",
        nif: "1234567",
        userId: users[1]?.id || "",
        website: "https://www.cocacolaportugal.pt/",
        verifiedStatusId: 1,
      },
      {
        about:
          "Apple, the innovative tech giant, revolutionizes the way we live, work, and connect. With its sleek and cutting-edge products, Apple has redefined the world of technology. From the iconic iPhone to the powerful Mac computers and the versatile iPad, Apple devices empower users to create, communicate, and explore like never before. With a seamless integration of hardware and software, Apple",
        cityId: 3,
        countryId: 1,
        name: "Apple",
        profilePicture:
          "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        profilePictureBlobName: "exampleBlob",
        nif: "1234567",
        userId: users[2]?.id || "",
        website: "https://www.apple.com/pt/",
        verifiedStatusId: 1,
      },
      {
        about:
          "LG, a leading global technology company, brings innovation and convenience to your everyday life. With a diverse range of products, LG jobs cutting-edge solutions that enhance your home, work, and entertainment experiences. From state-of-the-art televisions and home appliances to advanced mobile devices and cutting-edge audio systems, LG combines sleek design with exceptional performance. Immerse yourself in vibrant visuals",
        cityId: 3,
        countryId: 1,
        name: "LG",
        profilePicture:
          "https://images.unsplash.com/photo-1590664177914-9da6d6e8f0f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        profilePictureBlobName: "exampleBlob",
        nif: "1234567",
        userId: users[3]?.id || "",
        website: "https://www.lg.com/pt",
        verifiedStatusId: 1,
      },
      {
        about:
          "Tomas Oliveira, a charismatic adventurer with a passion for exploration. Born with wanderlust in his veins, he seeks thrill and beauty in every corner of the world. From climbing majestic mountains to diving into deep oceans, he embraces the unknown. With a heart full of curiosity, Tomas unravels diverse cultures, tasting exotic cuisines, and connecting with people from all walks of life. Through his travels, he's ",
        cityId: 3,
        countryId: 1,
        name: "Tomas Oliveira",
        profilePicture:
          "https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        profilePictureBlobName: "exampleBlob",
        nif: "1234567",
        userId: users[4]?.id || "",
        genderId: 1,
        website: "",
        verifiedStatusId: 1,
      },
      {
        about:
          "Andre Gomes, a charismatic adventurer with a passion for exploration. Born with wanderlust in his veins, he seeks thrill and beauty in every corner of the world. From climbing majestic mountains to diving into deep oceans, he embraces the unknown. With a heart full of curiosity, Tomas unravels diverse cultures, tasting exotic cuisines, and connecting with people from all walks of life. Through his travels, he's ",
        cityId: 3,
        countryId: 1,
        name: "Andre Gomes",
        profilePicture:
          "https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80",
        profilePictureBlobName: "exampleBlob",
        nif: "1234567",
        userId: users[5]?.id || "",
        genderId: 1,
        website: "",
        verifiedStatusId: 1,
      },
      {
        about:
          "Andreia Sofia, a charismatic adventurer with a passion for exploration. Born with wanderlust in his veins, he seeks thrill and beauty in every corner of the world. From climbing majestic mountains to diving into deep oceans, he embraces the unknown. With a heart full of curiosity, Tomas unravels diverse cultures, tasting exotic cuisines, and connecting with people from all walks of life. Through his travels, he's ",
        cityId: 3,
        countryId: 1,
        name: "Andreia Sofia",
        profilePicture:
          "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80",
        profilePictureBlobName: "exampleBlob",
        nif: "1234567",
        userId: users[6]?.id || "",
        genderId: 2,
        website: "",
        verifiedStatusId: 1,
      },
      {
        about:
          "Ines Guerreiro, a charismatic adventurer with a passion for exploration. Born with wanderlust in his veins, he seeks thrill and beauty in every corner of the world. From climbing majestic mountains to diving into deep oceans, he embraces the unknown. With a heart full of curiosity, Tomas unravels diverse cultures, tasting exotic cuisines, and connecting with people from all walks of life. Through his travels, he's ",
        cityId: 3,
        countryId: 1,
        name: "Ines Guerreiro",
        profilePicture:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=922&q=80",
        profilePictureBlobName: "exampleBlob",
        nif: "1234567",
        userId: users[7]?.id || "",
        genderId: 2,
        website: "",
        verifiedStatusId: 1,
      },
    ],
  });

  await prisma.userSocialMedia.createMany({
    data: [
      {
        followers: 42452,
        handler: "luky",
        socialMediaId: 1,
        url: "",
        profileId: 1,
      },
      {
        followers: 6476,
        handler: "Boyo",
        socialMediaId: 2,
        url: "",
        profileId: 1,
      },
      {
        followers: 20200,
        handler: "yohyrrt",
        socialMediaId: 1,
        url: "",
        profileId: 2,
      },
      {
        followers: 12567,
        handler: "yugute",
        socialMediaId: 2,
        url: "",
        profileId: 2,
      },
      {
        followers: 88765,
        handler: "wost",
        socialMediaId: 1,
        url: "",
        profileId: 3,
      },
      {
        followers: 54672,
        handler: "migu",
        socialMediaId: 2,
        url: "",
        profileId: 3,
      },
      {
        followers: 645,
        handler: "loreal",
        socialMediaId: 1,
        url: "",
        profileId: 4,
      },
      {
        followers: 6525,
        handler: "puias",
        socialMediaId: 2,
        url: "",
        profileId: 4,
      },
      {
        followers: 45623,
        handler: "quioa",
        socialMediaId: 1,
        url: "",
        profileId: 5,
      },
      {
        followers: 12345,
        handler: "xcad",
        socialMediaId: 2,
        url: "",
        profileId: 5,
      },
      {
        followers: 15778,
        handler: "polka",
        socialMediaId: 1,
        url: "",
        profileId: 6,
      },
      {
        followers: 423563,
        handler: "shopt",
        socialMediaId: 2,
        url: "",
        profileId: 6,
      },
      {
        followers: 12376,
        handler: "tiogk",
        socialMediaId: 1,
        url: "",
        profileId: 7,
      },
      {
        followers: 32412,
        handler: "nagi",
        socialMediaId: 2,
        url: "",
        profileId: 7,
      },
      {
        followers: 5342,
        handler: "epasu",
        socialMediaId: 1,
        url: "",
        profileId: 8,
      },
      {
        followers: 3667,
        handler: "ugua",
        socialMediaId: 2,
        url: "",
        profileId: 8,
      },
    ],
  });

  await prisma.valuePack.createMany({
    data: [
      {
        userSocialMediaId: 1,
        valuePackPrice: 1000,
        contentTypeId: 1,
      },
      {
        userSocialMediaId: 1,
        valuePackPrice: 1000,
        contentTypeId: 1,
      },
      {
        userSocialMediaId: 1,
        valuePackPrice: 1000,
        contentTypeId: 1,
      },
      {
        userSocialMediaId: 1,
        valuePackPrice: 1000,
        contentTypeId: 1,
      },
      {
        userSocialMediaId: 1,
        valuePackPrice: 1000,
        contentTypeId: 1,
      },
      {
        userSocialMediaId: 1,
        valuePackPrice: 1000,
        contentTypeId: 1,
      },
      {
        userSocialMediaId: 1,
        valuePackPrice: 1000,
        contentTypeId: 1,
      },
      {
        userSocialMediaId: 1,
        valuePackPrice: 1000,
        contentTypeId: 1,
      },
    ],
  });

  await prisma.portfolio.createMany({
    data: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        blobName: "exampleBlob",
        profileId: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1790&q=80",
        blobName: "exampleBlob",
        profileId: 1,
      },
      {
        url: "https://images.unsplash.com/photo-1589423045402-6074a1bdf723?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=902&q=80",
        blobName: "exampleBlob",
        profileId: 2,
      },
      {
        url: "https://images.unsplash.com/photo-1561758033-48d52648ae8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        blobName: "exampleBlob",
        profileId: 2,
      },
      {
        url: "https://images.unsplash.com/photo-1530018352490-c6eef07fd7e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=836&q=80",
        blobName: "exampleBlob",
        profileId: 3,
      },
      {
        url: "https://images.unsplash.com/photo-1587071292164-aa5ab1c8c706?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        blobName: "exampleBlob",
        profileId: 3,
      },
      {
        url: "https://images.unsplash.com/flagged/photo-1572609239482-d3a83f976aa0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80",
        blobName: "exampleBlob",
        profileId: 4,
      },
      {
        url: "https://images.unsplash.com/photo-1613280194169-6bb2f32a6bfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80",
        blobName: "exampleBlob",
        profileId: 4,
      },
      {
        url: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
        blobName: "exampleBlob",
        profileId: 5,
      },
      {
        url: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        blobName: "exampleBlob",
        profileId: 6,
      },
      {
        url: "https://images.unsplash.com/photo-1521566652839-697aa473761a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80",
        blobName: "exampleBlob",
        profileId: 7,
      },
      {
        url: "https://images.unsplash.com/photo-1465429167186-266ef03d6277?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
        blobName: "exampleBlob",
        profileId: 8,
      },
    ],
  });

  await prisma.review.createMany({
    data: [
      {
        rating: 4,
        authorId: 1,
        userReview: "Really awesome job and I am very happy",
        profileReviewdId: 5,
      },
      {
        rating: 5,
        authorId: 2,
        userReview:
          "Best influencer I ever hired! Thank you so much and very recommended",
        profileReviewdId: 5,
      },
      {
        rating: 5,
        authorId: 3,
        userReview: "Vwey cool and I am really happy with the result.",
        profileReviewdId: 5,
      },
      {
        rating: 5,
        authorId: 3,
        userReview: "I will send double the review because I am really happy",
        profileReviewdId: 5,
      },
      {
        rating: 4,
        authorId: 4,
        userReview: "It was a nice job done by this person",
        profileReviewdId: 5,
      },
      {
        rating: 4,
        authorId: 1,
        userReview: "Really awesome job and I am very happy",
        profileReviewdId: 6,
      },
      {
        rating: 5,
        authorId: 2,
        userReview:
          "Best influencer I ever hired! Thank you so much and very recommended",
        profileReviewdId: 6,
      },
      {
        rating: 5,
        authorId: 3,
        userReview: "Vwey cool and I am really happy with the result.",
        profileReviewdId: 6,
      },
      {
        rating: 5,
        authorId: 3,
        userReview: "I will send double the review because I am really happy",
        profileReviewdId: 6,
      },
      {
        rating: 4,
        authorId: 4,
        userReview: "It was a nice job done by this person",
        profileReviewdId: 6,
      },
      {
        rating: 4,
        authorId: 1,
        userReview: "Really awesome job and I am very happy",
        profileReviewdId: 7,
      },
      {
        rating: 5,
        authorId: 2,
        userReview:
          "Best influencer I ever hired! Thank you so much and very recommended",
        profileReviewdId: 7,
      },
      {
        rating: 5,
        authorId: 3,
        userReview: "Vwey cool and I am really happy with the result.",
        profileReviewdId: 7,
      },
      {
        rating: 5,
        authorId: 3,
        userReview: "I will send double the review because I am really happy",
        profileReviewdId: 7,
      },
      {
        rating: 4,
        authorId: 4,
        userReview: "It was a nice job done by this person",
        profileReviewdId: 7,
      },
      {
        rating: 4,
        authorId: 1,
        userReview: "Really awesome job and I am very happy",
        profileReviewdId: 8,
      },
      {
        rating: 5,
        authorId: 2,
        userReview:
          "Best influencer I ever hired! Thank you so much and very recommended",
        profileReviewdId: 8,
      },
      {
        rating: 5,
        authorId: 3,
        userReview: "Vwey cool and I am really happy with the result.",
        profileReviewdId: 8,
      },
      {
        rating: 5,
        authorId: 3,
        userReview: "I will send double the review because I am really happy",
        profileReviewdId: 8,
      },
      {
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
