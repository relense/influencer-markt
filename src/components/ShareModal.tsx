import Link from "next/link";
import { Modal } from "./Modal";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import { useTranslation } from "next-i18next";
const ShareModal = (params: {
  onClose: () => void;
  url: string;
  modalTitle: string;
}) => {
  const { t } = useTranslation();

  const onCopyLinkToShare = async () => {
    await navigator.clipboard.writeText(params.url);

    toast.success(t("components.shareModal.copySuccessfull"), {
      duration: 5000,
      position: "bottom-left",
    });
  };

  const renderLinkToCopy = () => {
    return (
      <div
        className="flex flex-1 cursor-pointer justify-center gap-2 rounded-lg bg-influencer px-4 py-2 hover:bg-influencer-dark"
        onClick={() => onCopyLinkToShare()}
      >
        <FontAwesomeIcon icon={faCopy} className="fa-lg text-white" />
        <div className="flex text-white">{t("components.shareModal.copy")}</div>
      </div>
    );
  };

  return (
    <Modal onClose={() => params.onClose()} title={params.modalTitle}>
      <div className="flex flex-col gap-4 p-4 sm:w-full sm:px-8">
        <div className="flex justify-center">
          <Link
            href={`https://api.whatsapp.com/send/?text=${params.url}`}
            data-action="share/whatsapp/share"
          >
            <Image
              src={`/images/whatsapp.svg`}
              height={44}
              width={44}
              alt="whatsapp logo"
              className="object-contain"
            />
          </Link>
        </div>

        <div className="flex h-14 w-full flex-1 gap-2 rounded-lg border-[1px] border-gray3 p-2">
          <input readOnly value={params.url} className="flex flex-1" />
          <div className="hidden sm:flex">{renderLinkToCopy()}</div>
        </div>
        <div className="flex sm:hidden">{renderLinkToCopy()}</div>
      </div>
    </Modal>
  );
};

export { ShareModal };
