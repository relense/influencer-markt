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

const OfferDetailsPage = () => {
  const { t } = useTranslation();
  //   const { data: offer } = api.offers.getAllOffers.useQuery({ offerId });

  return (
    <div className="flex flex-1 flex-col justify-start gap-6 p-6 sm:flex-row lg:w-full lg:gap-6 lg:p-12 xl:self-center xl:p-4 2xl:w-3/4">
      details
    </div>
  );
};

export { OfferDetailsPage };
