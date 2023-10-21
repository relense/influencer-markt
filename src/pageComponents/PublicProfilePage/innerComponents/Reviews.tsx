import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import { api } from "~/utils/api";
import { Review } from "../../../components/Review";
import { Button } from "../../../components/Button";
import { useEffect, useState } from "react";
import { helper } from "../../../utils/helper";

const Reviews = (params: {
  profileId: number;
  openReviewModal: (review: Review) => void;
}) => {
  const { t, i18n } = useTranslation();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsCursor, setCursor] = useState<number>();

  const { data: ratingsInfo } = api.reviews.getAverageReviewsRating.useQuery({
    profileId: params.profileId,
  });

  const { data: profileReviews } = api.reviews.getProfileReviews.useQuery({
    profileId: params.profileId,
  });

  const {
    data: profileReviewsCursor,
    isFetching: isFetchingReviewsCursor,
    refetch: isRefetchingWithCursor,
  } = api.reviews.getProfileReviewsWithCursor.useQuery(
    {
      profileId: params.profileId,
      cursor: reviewsCursor || -1,
    },
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (profileReviews) {
      setReviews(
        profileReviews[2].map((review) => {
          return {
            id: review.id,
            authorName: review.author?.name || "",
            profilePicture: review.author?.profilePicture || "",
            review: review.userReview || "",
            reviewDate: helper.formatDate(review.createdAt, i18n.language),
            username: review.author?.user.username || "",
          };
        })
      );

      const lastReviewInArray = profileReviews[2][profileReviews[1].length - 1];

      if (lastReviewInArray) {
        setCursor(lastReviewInArray.id);
      }
    }
  }, [i18n.language, profileReviews]);

  useEffect(() => {
    if (profileReviewsCursor) {
      const newReviews: Review[] = [...reviews];

      profileReviewsCursor.forEach((review) => {
        newReviews.push({
          id: review.id,
          authorName: review.author?.name || "",
          profilePicture: review.author?.profilePicture || "",
          review: review.userReview || "",
          reviewDate: helper.formatDate(review.createdAt, i18n.language),
          username: review.author?.user.username || "",
        });
      });

      setReviews(newReviews);

      const lastReviewInArray =
        profileReviewsCursor[profileReviewsCursor.length - 1];

      if (lastReviewInArray) {
        setCursor(lastReviewInArray.id);
      }
    }
  }, [i18n.language, profileReviewsCursor, reviews]);

  if (ratingsInfo && ratingsInfo[1] && ratingsInfo[1] > 0) {
    return (
      <>
        <div className="w-full border-[1px] border-gray3" />
        <div className="flex flex-1 flex-col gap-10">
          <div className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-1">
              <FontAwesomeIcon
                icon={faStar}
                className="fa-lg cursor-pointer pb-1"
              />
              <div className="text-xl font-semibold">{ratingsInfo[0]}</div>
            </div>
            <div className="h-2 w-2 rounded-full bg-black" />
            <div className="text-xl font-semibold">
              {ratingsInfo && ratingsInfo[1] > 0 ? (
                <div>
                  {t("pages.publicProfilePage.reviews", {
                    count: ratingsInfo[1],
                  })}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-start gap-12">
            {reviews.map((review) => {
              return (
                <Review
                  key={review.id}
                  review={{
                    profilePicture: review.profilePicture,
                    authorName: review.authorName,
                    review: review.review,
                    reviewDate: review.reviewDate,
                    username: review.username,
                  }}
                  isModal={false}
                  onClick={() => params.openReviewModal(review)}
                />
              );
            })}
          </div>
          {ratingsInfo[1] > reviews.length && (
            <div className="flex items-center justify-center">
              <Button
                title={t("pages.publicProfilePage.loadMore")}
                onClick={() => isRefetchingWithCursor()}
                isLoading={isFetchingReviewsCursor}
              />
            </div>
          )}
        </div>
      </>
    );
  }
};

export { Reviews };
