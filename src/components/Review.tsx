import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { type Review } from "../utils/globalTypes";

const Review = (params: {
  review: Review;
  onClick: (review: Review) => void;
  isModal: boolean;
}) => {
  const { t } = useTranslation();

  let mainClassName = "flex flex-col gap-4 flex-[1_0_100%] lg:flex-[0_0_47%]";
  if (params.isModal) {
    mainClassName = "flex flex-col gap-4";
  }
  return (
    <div className={mainClassName}>
      <div className="flex flex-1 items-center gap-2">
        <Image
          src={params.review.profilePicture}
          alt="profile picture"
          width={56}
          height={56}
          className="h-14 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <Link
            href={`/${params.review.username}`}
            className="cursor-pointer font-medium"
          >
            {params.review.authorName}
          </Link>
          <div className="font-normal text-gray2">
            {params.review.reviewDate}
          </div>
        </div>
      </div>
      <div>
        <div>
          {!params.isModal ? (
            <div className="line-clamp-4">{params.review.review}</div>
          ) : (
            <div>{params.review.review}</div>
          )}{" "}
          {!params.isModal && (
            <span
              className="cursor-pointer font-medium text-influencer"
              onClick={() => params.onClick(params.review)}
            >
              {t("components.review.readMore")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export { Review };
