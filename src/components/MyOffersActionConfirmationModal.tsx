import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

import { Modal } from "./Modal";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";
import { useRouter } from "next/router";

const MyOffersActionConfirmationModal = (params: {
  onClose: () => void;
  type: "archive" | "delete" | "publish";
  offerId: number;
  isOfferDetails: boolean;
}) => {
  const { t } = useTranslation();
  const ctx = api.useContext();
  const router = useRouter();

  const { mutate: publishOffer } = api.offers.publishOffer.useMutation({
    onSuccess: () => {
      void ctx.offers.getAllUserOffers.invalidate().then(() => {
        toast.success(t("components.myOfferDropDown.offerPublished"), {
          position: "bottom-left",
        });
      });
    },
  });

  const { mutate: archiveOffer } = api.offers.archiveOffer.useMutation({
    onSuccess: () => {
      void ctx.offers.getAllUserOffers.invalidate().then(() => {
        toast.success(t("components.myOfferDropDown.offerArchived"), {
          position: "bottom-left",
        });
      });
    },
  });

  const { mutate: deleteOffer } = api.offers.deleteOffer.useMutation({
    onSuccess: () => {
      void router.push("/my-offers");
      void ctx.offers.getAllUserOffers.invalidate().then(() => {
        toast.success(t("components.myOfferDropDown.offerDeleted"), {
          position: "bottom-left",
        });
      });
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    params.onClose();
    if (params.type === "publish") {
      publishOffer({ offerId: params.offerId });
    } else if (params.type === "archive") {
      archiveOffer({ offerId: params.offerId });
    } else if (params.type === "delete") {
      deleteOffer({ offerId: params.offerId });
    }
  };

  return (
    <Modal
      onClose={() => params.onClose()}
      button={
        <div className="flex justify-center p-4">
          <Button
            type="submit"
            title={t(`pages.myOffer.${params.type}Button`)}
            level="primary"
            form="form-warningModal"
          />
        </div>
      }
    >
      <form
        id="form-warningModal"
        onSubmit={submit}
        className="flex flex-col gap-4 p-4"
      >
        <div className="text-center text-3xl font-semibold text-influencer">
          {t("pages.myOffer.areYouSure")}
        </div>
        <div className="text-center text-lg">
          {t(`pages.myOffer.${params.type}Warning`)}
        </div>
      </form>
    </Modal>
  );
};

export { MyOffersActionConfirmationModal };
