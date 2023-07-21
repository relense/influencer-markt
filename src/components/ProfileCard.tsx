import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";

import { helper } from "../utils/helper";
import type { UserSocialMedia } from "../utils/globalTypes";

const ProfileCard = (params: {
  profilePicture: string;
  socialMedia: UserSocialMedia[];
  name: string;
  about: string;
  city: string;
  country: string;
  username: string;
}) => {
  const [usefullSocialMedia, setUsefullSocialMedia] = useState<UserSocialMedia>(
    {
      followers: -1,
      handler: "",
      id: -1,
      socialMediaName: "",
      url: "",
      valuePacks: [],
    }
  );

  useEffect(() => {
    const socialMediaWithMostFollowers = () => {
      params.socialMedia.forEach((socialMedia) => {
        if (socialMedia.followers > usefullSocialMedia.followers) {
          setUsefullSocialMedia(socialMedia);
        }
      });
    };

    socialMediaWithMostFollowers();
  }, [params.socialMedia, usefullSocialMedia.followers]);

  return (
    <div className="flex w-full  flex-col gap-2 lg:w-80">
      <div className="relative h-80 w-full self-center overflow-hidden rounded-xl shadow-xl lg:w-80">
        <Link href={`/${params.username}`}>
          <Image
            src={params.profilePicture}
            height={1000}
            width={1000}
            quality={100}
            alt={params.name}
            className="flex h-80 w-full cursor-pointer rounded-xl object-cover transition-all duration-1000 hover:scale-125 lg:w-80"
            priority
          />
        </Link>

        <div className="absolute left-2 top-2 flex gap-1 rounded-3xl border-[1px] bg-black-transparent px-4 text-white">
          <div>
            {helper.formatNumber(usefullSocialMedia.followers)}{" "}
            {usefullSocialMedia.socialMediaName} Followers
          </div>
        </div>

        <div className="absolute right-2 top-2 cursor-pointer">
          <FontAwesomeIcon icon={faBookmark} className="fa-xl text-white" />
        </div>
      </div>
      <div>
        <div className="flex justify-between">
          <div className="flex flex-wrap gap-2">
            {params.socialMedia.map((socialMedia, index) => {
              if (index > 1) return;
              return (
                <Link
                  href={socialMedia.url}
                  key={socialMedia.id}
                  className="font-bold text-influencer"
                >
                  {socialMedia.socialMediaName}
                </Link>
              );
            })}
          </div>
          <div className="text-lg font-semibold">
            {usefullSocialMedia.valuePacks[0]?.valuePackPrice}€
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-xl font-bold">{params.name}</div>
        <div className="text-sm text-gray2">
          {params.country}, {params.city}
        </div>
      </div>
      <div>
        <div className="line-clamp-4 text-gray2">{params.about}</div>
        <Link
          href={`/${params.username}`}
          className="font-bold text-influencer"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export { ProfileCard };
