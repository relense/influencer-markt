import type { Prisma, SocialMedia } from "@prisma/client";

export type SocialMediaWithContentTypes = Prisma.SocialMediaGetPayload<{
  include: { contentTypes: true };
}>;

export type ValuePack = {
  id?: number;
  platform: Option;
  contentType: Option;
  valuePackPrice: number;
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
  socialMediaId: number;
  valuePacks?: ValuePack[];
  mainSocialMedia: boolean;
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
  is18: boolean;
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
  mainSocialMedia: boolean;
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
  id: string;
  profilePicture: string;
  socialMedia: UserSocialMedia[];
  name: string;
  about: string;
  city: Option;
  country: Option;
  username: string;
  bookmarked?: boolean;
  favoritedBy?: number[];
  activeJobs?: number;
};

export type ProfileJobs = Prisma.JobGetPayload<{
  select: {
    jobSummary: true;
    id: true;
    contentTypeWithQuantity: {
      select: {
        amount: true;
        contentType: true;
        id: true;
      };
    };
    country: true;
    socialMedia: true;
    state: true;
  };
}>;

export type JobWithAllData = Prisma.JobGetPayload<{
  include: {
    id?: true;
    jobStatus: true;
    categories: true;
    applicants: { select: { id: true } };
    acceptedApplicants: { select: { id: true } };
    contentTypeWithQuantity: {
      select: {
        amount: true;
        contentType: true;
        id: true;
      };
    };
    jobCreator: true;
    country: true;
    gender: true;
    socialMedia: true;
    state: true;
  };
}>;

export type JobIncludes = Prisma.JobGetPayload<{
  include: {
    contentTypeWithQuantity: {
      select: {
        amount: true;
        contentType: true;
        id: true;
      };
    };
    jobStatus: true;
    country: true;
    state: true;
    gender: true;
    socialMedia: true;
    jobCreator: {
      include: {
        user: true;
      };
    };
    categories: true;
    applicants: true;
    acceptedApplicants: true;
    rejectedApplicants: true;
  };
}>;

export type TicketType = Prisma.ContactMessageGetPayload<{
  include: {
    contactMessageState: true;
    reason: true;
  };
}>;
