import Image from "next/image";

export type Review = {
  profilePicture: string;
  authorName: string;
  reviewDate: string;
  review: string;
};

const Review = (params: {
  review: Review;
  onClick: (review: Review) => void;
  isModal: boolean;
}) => {
  let mainClassName = "flex flex-col gap-4 flex-[1_0_100%] lg:flex-[0_0_40%]";
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
          <div className="font-medium">{params.review.authorName}</div>
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
              Read More
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export { Review };