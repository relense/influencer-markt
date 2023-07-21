import type { Prisma, SocialMedia } from "@prisma/client";

export type SocialMediaWithContentTypes = Prisma.SocialMediaGetPayload<{
  include: { contentTypes: true };
}>;

export type ValuePack = {
  id?: number;
  platform: Option;
  contentType: Option;
  deliveryTime: string;
  numberOfRevisions: string;
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
  placeThatLives: string;
  about: string;
  website: string;
};
