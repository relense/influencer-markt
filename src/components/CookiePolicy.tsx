import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { useTranslation } from "react-i18next";

const CookiePolicy = () => {
  const { t } = useTranslation();

  const [openCookiePolicyModal, setOpenCookiePolicyModal] =
    useState<boolean>(false);
  const [showCookiePolicy, setShowCookiePolicy] = useState<boolean>(false);

  useEffect(() => {
    if (!localStorage.getItem("cookiePolicy")) {
      setShowCookiePolicy(true);
    }
  }, []);

  const handleAgreeWithPolicy = () => {
    setOpenCookiePolicyModal(false);
    localStorage.setItem("cookiePolicy", "false");
    setShowCookiePolicy(false);
  };

  const renderCookiePolicy = () => {
    return (
      <div className="fixed bottom-14 z-50 flex h-auto w-full flex-1 flex-col items-center justify-center gap-4 border-t-[1px] bg-white p-4 lg:bottom-0 lg:flex-row lg:gap-2">
        {t("components.cookiePolicy.row.description")}{" "}
        <span
          className="cursor-pointer font-semibold underline"
          onClick={() => setOpenCookiePolicyModal(true)}
        >
          {t("components.cookiePolicy.row.cookiePolicy")}
        </span>{" "}
        <Button
          title={t("components.cookiePolicy.row.button")}
          level="primary"
          size="regular"
          onClick={() => handleAgreeWithPolicy()}
        />
      </div>
    );
  };

  const renderCookiePolicyModal = () => {
    if (openCookiePolicyModal) {
      return (
        <div className="flex justify-center">
          <Modal
            title="Cookie Policy"
            button={
              <div className="flex justify-center p-4">
                <Button
                  title="Close"
                  level="primary"
                  onClick={() => setOpenCookiePolicyModal(false)}
                />
              </div>
            }
            onClose={() => setOpenCookiePolicyModal(false)}
          >
            <div className="flex flex-col gap-6 p-4 text-sm">
              <div className="flex flex-col gap-2">
                <div className="font-semibold">
                  {t("components.cookiePolicy.modal.title1")}
                </div>
                <div>{t("components.cookiePolicy.modal.subtitle1")}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-semibold">
                  {t("components.cookiePolicy.modal.title2")}
                </div>
                <div>{t("components.cookiePolicy.modal.subtitle2")}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-semibold">
                  {t("components.cookiePolicy.modal.title3")}
                </div>
                <div>{t("components.cookiePolicy.modal.subtitle3")}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-semibold">
                  {t("components.cookiePolicy.modal.title4")}
                </div>
                <div>{t("components.cookiePolicy.modal.subtitle4")}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-semibold">
                  {t("components.cookiePolicy.modal.title5")}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-semibold">
                  {t("components.cookiePolicy.modal.title6")}
                </div>
                <div>{t("components.cookiePolicy.modal.subtitle6")}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-semibold">
                  {t("components.cookiePolicy.modal.title7")}
                </div>
                <div>{t("components.cookiePolicy.modal.subtitle7")}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-semibold">
                  {t("components.cookiePolicy.modal.title8")}
                </div>
                <div>{t("components.cookiePolicy.modal.subtitle8")}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-semibold">
                  {t("components.cookiePolicy.modal.title9")}
                </div>
                <div>{t("components.cookiePolicy.modal.subtitle9")}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="font-semibold">
                  {t("components.cookiePolicy.modal.title10")}
                </div>
                <div>{t("components.cookiePolicy.modal.subtitle10")}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div>{t("components.cookiePolicy.modal.subtitle11")}</div>
              </div>
            </div>
          </Modal>
        </div>
      );
    }
  };

  if (showCookiePolicy) {
    return (
      <>
        {renderCookiePolicy()}
        {renderCookiePolicyModal()}
      </>
    );
  }
};

export { CookiePolicy };
