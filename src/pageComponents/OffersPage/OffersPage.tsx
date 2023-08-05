import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faCircleCheck,
  faEllipsis,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";

import { CreateOfferModal } from "./innerComponent/CreateOfferModal";
import { useRouter } from "next/router";
import { type Prisma } from "@prisma/client";

export type OfferWithIncludes = Prisma.OfferGetPayload<{
  include: {
    applicants: { select: { id: true } };
    acceptedApplicants: { select: { id: true } };
  };
}>;

const OffersPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);

  const { data: offers } = api.offers.getAllOffers.useQuery();

  const renderOffer = (offer: OfferWithIncludes) => {
    return (
      <div
        key={offer.id}
        className="relative flex h-auto flex-[0_1_49%] cursor-pointer flex-col justify-between gap-4 rounded-xl border-[1px] p-4"
        onClick={() => void router.push(`/offers/${offer.id}`)}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-2">
            <div className="line-clamp-2 w-32 font-semibold xs:w-full">
              {offer.offerSummary}
            </div>
            <div className="hover:text-influencer">
              <FontAwesomeIcon
                icon={faEllipsis}
                className="fa-xl cursor-pointer "
              />
            </div>
          </div>
          <div className="line-clamp-3">{offer.OfferDetails}</div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="fa-xl cursor-pointer text-influencer"
            />
            <div className="font-semibold">
              {offer.applicants.length} Applicants
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="fa-xl cursor-pointer text-influencer"
            />
            <div className="font-semibold">
              {offer.acceptedApplicants.length}/{offer.numberOfInfluencers}{" "}
              Openings
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-1 flex-col justify-start gap-6 p-6 lg:w-full lg:gap-6 lg:p-12 xl:self-center xl:p-4 2xl:w-3/4">
        <div
          className="flex h-auto cursor-pointer items-center justify-center gap-2 rounded-xl border-[1px] p-4 hover:bg-light-red"
          onClick={() => setOpenCreateModal(true)}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-influencer text-white">
            <FontAwesomeIcon icon={faPlus} className="fa-sm cursor-pointer" />
          </div>
          <div>{t("pages.offer.createOffer")}</div>
        </div>
        <div className="text-xl font-semibold">Open Offers</div>
        <div className="flex flex-wrap gap-4">
          {offers?.map((offer) => {
            if (offer.isOpen) {
              return renderOffer(offer);
            }
          })}
        </div>
      </div>
      <div className="flex justify-center">
        {openCreateModal && (
          <CreateOfferModal onClose={() => setOpenCreateModal(false)} />
        )}
      </div>
    </>
  );
};

export { OffersPage };
