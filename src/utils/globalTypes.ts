import type { Prisma, SocialMedia } from "@prisma/client";

export type SocialMediaWithContentTypes = Prisma.SocialMediaGetPayload<{
  include: { contentTypes: true };
}>;

export type ValuePack = {
  id?: number;
  platform: Option;
  contentType: Option;
  valuePackPrice: string;
};

export type Option = {
  id: number;
  name: string;
};

export type Picture = {
  id: number;
  url: string;
};

export type UserSocialMedia = {
  id: number;
  handler: string;
  followers: number;
  url: string;
  socialMediaName: string;
  valuePacks: ValuePack[];
};

export type Review = {
  id?: number;
  profilePicture: string;
  authorName: string;
  reviewDate: string;
  review: string;
  username: string;
};

export type QuestionType = {
  question: string;
  answer: string;
};

export type UserIdentityData = {
  username: string;
  role: Option;
};

export type SocialMediaData = {
  socialMedia: SocialMediaDetails[];
};

export type SocialMediaDetails = {
  id?: number;
  platform: SocialMedia;
  socialMediaHandler: string;
  socialMediaFollowers: number;
  valuePacks: ValuePack[];
};

export type ProfileData = {
  profilePicture: string;
  displayName: string;
  gender: Option;
  categories: Option[];
  nationOfBirth: Option;
  placeThatLives: Option;
  about: string;
  website: string;
};

export type UserProfiles = {
  id: number;
  profilePicture: string;
  socialMedia: UserSocialMedia[];
  name: string;
  about: string;
  city: Option;
  country: Option;
  username: string;
  bookmarked?: boolean;
  favoritedBy?: number[];
};

export type OfferWithAllData = Prisma.OfferGetPayload<{
  include: {
    id?: true;
    acceptedApplicants: {
      select: {
        id: true;
        profilePicture: true;
        userSocialMedia: {
          include: {
            socialMedia: true;
          };
        };
        name: true;
        about: true;
        city: true;
        country: true;
        user: { select: { username: true } };
      };
    };
    categories: true;
    applicants: { select: { id: true } };
    contentTypeWithQuantity: {
      select: {
        amount: true;
        contentType: true;
        id: true;
      };
    };
    offerCreator: true;
    country: true;
    gender: true;
    socialMedia: true;
    state: true;
  };
}>;

export type OfferIncludes = Prisma.OfferGetPayload<{
  include: {
    contentTypeWithQuantity: {
      select: {
        amount: true;
        contentType: true;
        id: true;
      };
    };
    country: true;
    state: true;
    gender: true;
    socialMedia: true;
    offerCreator: true;
    categories: true;
    applicants: true;
    acceptedApplicants: true;
  };
}>;
