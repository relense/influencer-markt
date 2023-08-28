import { Modal } from "./Modal";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";

const MyOffersActionConfirmationModal = (params: {
  onClose: () => void;
  type: "archive" | "delete" | "publish";
  offerId: number;
  isOfferDetails: boolean;
  publishOffer: (offerId: number) => void;
  archiveOffer: (offerId: number) => void;
  deleteOffer: (offerId: number) => void;
}) => {
  const { t } = useTranslation();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    params.onClose();
    if (params.type === "publish") {
      params.publishOffer(params.offerId);
    } else if (params.type === "archive") {
      params.archiveOffer(params.offerId);
    } else if (params.type === "delete") {
      params.deleteOffer(params.offerId);
    }
  };

  return (
    <Modal
      onClose={() => params.onClose()}
      button={
        <div className="flex justify-center p-4">
          <Button
            type="submit"
            title={t(`pages.manageOffers.${params.type}Button`)}
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
          {t("pages.manageOffers.areYouSure")}
        </div>
        <div className="text-center text-lg">
          {t(`pages.manageOffers.${params.type}Warning`)}
        </div>
      </form>
    </Modal>
  );
};

export { MyOffersActionConfirmationModal };
