type Step = {
  step: string;
  title: string;
  subTitle: string;
  mainTitle: string;
  mainSubTitle: string;
};

type Option = {
  id: number;
  option: string;
};

// FORM TYPES
type ProfileData = {
  profilePicture: string;
  displayName: string;
  role: Option;
  categories: Option[];
  country: string;
  city: string;
  about: string;
};

export type { Step, ProfileData, Option };
