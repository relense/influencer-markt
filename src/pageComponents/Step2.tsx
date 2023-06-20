import { useForm } from "react-hook-form";
import { StepsReminder } from "../components/StepsReminder/StepsReminder";

type SocialMediaInput = {
  socialMedia: string;
  placeholderTitle: string;
  placeholderSubtitle: string;
};

const socialMediaPlaceHolders: SocialMediaInput[] = [
  {
    socialMedia: "instagram",
    placeholderTitle: "Instagram Handle: Share Your @Username",
    placeholderSubtitle: "Instagram Followers",
  },
  {
    socialMedia: "twitter",
    placeholderTitle: "Twitter Handle: Enter Your @Username",
    placeholderSubtitle: "Twitter Followers",
  },
  {
    socialMedia: "tiktok",
    placeholderTitle: "TikTok Username: Share Your TikTok Handle",
    placeholderSubtitle: "TikTok Followers",
  },
  {
    socialMedia: "youtube",
    placeholderTitle: "YouTube Channel: Enter Your YouTube Username",
    placeholderSubtitle: "YouTube Subscribers",
  },
  {
    socialMedia: "facebook",
    placeholderTitle: "Facebook Page: Provide Your Facebook Page URL",
    placeholderSubtitle: "Facebook Followers",
  },
  {
    socialMedia: "linkedin",
    placeholderTitle: "LinkedIn Profile: Share Your LinkedIn Profile URL",
    placeholderSubtitle: "LinkedIn Connections",
  },
  {
    socialMedia: "pinterest",
    placeholderTitle: "Pinterest Account: Enter Your Pinterest Profile URL",
    placeholderSubtitle: "Pinterest Followers",
  },
  {
    socialMedia: "twitch",
    placeholderTitle: "Twitch Channel: Provide Your Twitch Channel Nam",
    placeholderSubtitle: "Twitch Followers",
  },
];

export const Step2 = (params: {
  changeStep: (value: "next" | "previous") => void;
}) => {
  const {
    register: registerSocialMedia,
    handleSubmit: handleSubmitSocialMedia,
    formState: { errors: errorsSocialMedia },
  } = useForm();

  const onSubmitStep2 = handleSubmitSocialMedia((data) => {
    params.changeStep("next");
  });

  return (
    <div className="mt-2 flex flex-1 flex-col items-center gap-4 lg:mt-11 lg:overflow-y-auto">
      <form
        id="form-hook"
        onSubmit={onSubmitStep2}
        className="mt-4 flex w-3/4 flex-col gap-6 sm:w-full lg:w-3/4"
      >
        <input
          {...registerSocialMedia("website")}
          type="text"
          className="h-14 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
          placeholder="Website URL: Provide Your Website Address"
        />
        {socialMediaPlaceHolders.map((item) => {
          return (
            <div
              key={item.placeholderTitle}
              className="flex flex-col gap-6 lg:flex-row"
            >
              <input
                {...registerSocialMedia(`${item.socialMedia}Handle`)}
                type="text"
                className="h-14 w-full rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
                placeholder={item.placeholderTitle}
              />
              <input
                {...registerSocialMedia(`${item.socialMedia}Followers`)}
                type="text"
                className="h-14 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
                placeholder={item.placeholderSubtitle}
              />
            </div>
          );
        })}
      </form>
      <StepsReminder />
    </div>
  );
};
