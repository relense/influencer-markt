import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { api } from "~/utils/api";

import { Button } from "../../components/Button";
import { CustomSelect } from "../../components/CustomSelect";
import type { Option } from "../../components/CustomMultiSelect";
import { useEffect, useState } from "react";
import { Modal } from "../../components/Modal";
import Link from "next/link";

type ContactUsData = {
  reason: Option;
  name: string;
  email: string;
  message: string;
};

const ContactUsPage = () => {
  const { t } = useTranslation();
  const { data: reasons } = api.allRoutes.getAllMessageReasons.useQuery();
  const [showFirstTimeModal, setShowFirstTimeModal] = useState<boolean>(false);

  const setfirstVisitInfo = () => {
    setShowFirstTimeModal(false);
    localStorage.setItem("isfirstVisit", "false");
  };

  useEffect(() => {
    if (!localStorage.getItem("isfirstVisit")) {
      setShowFirstTimeModal(true);
    }
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactUsData>({
    defaultValues: {
      reason: { id: -1, name: "" },
    },
  });

  const submitMessage = handleSubmit((data) => {
    console.log(JSON.stringify(data));
  });

  return (
    <div className="flex flex-1 flex-col justify-center gap-8 p-4 xl:w-3/4 xl:self-center 2xl:w-2/4">
      <div className="flex flex-1 justify-center text-center font-playfair text-5xl font-semibold">
        {t("pages.contactUs.title")}
      </div>
      <form
        id="form-contactUs"
        className="flex h-full w-full flex-col gap-4 p-4 sm:w-full sm:px-8"
        onSubmit={submitMessage}
      >
        <div className="flex flex-col gap-4">
          <Controller
            name="reason"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => {
              return (
                <CustomSelect
                  register={register}
                  name="reason"
                  placeholder={t("pages.contactUs.reasonPlaceholder")}
                  options={
                    reasons?.map((reason) => {
                      return {
                        id: reason.id,
                        name: t(`general.reasons.${reason.name}`),
                      };
                    }) || [{ id: -1, name: "" }]
                  }
                  value={value}
                  handleOptionSelect={onChange}
                />
              );
            }}
          />
        </div>
        <div className="flex w-full flex-col gap-4 lg:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            <input
              {...register("name")}
              required
              type="text"
              className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
              placeholder={t("pages.contactUs.nameInputPlaceholder")}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <input
              {...register("email")}
              required
              type={t("pages.contactUs.emailInputPlaceholder")}
              className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
              placeholder="Email"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col">
          <textarea
            {...register("message", { maxLength: 446 })}
            required
            className="flex flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12"
            placeholder={t("pages.contactUs.messageInputPlaceholder")}
            autoComplete="off"
          />
          {errors.message && errors.message.type === "maxLength" && (
            <div className="px-4 py-1 text-red-600">
              {t("pages.contactUs.warningMessage", { count: 446 })}
            </div>
          )}
        </div>

        <div className="flex justify-center p-4">
          <Button
            type="submit"
            title="Send Message"
            level="primary"
            form="form-contactUs"
          />
        </div>
      </form>
      {showFirstTimeModal && (
        <div className="flex justify-center">
          <Modal onClose={() => setfirstVisitInfo()}>
            <div className="flex h-full w-full flex-1 cursor-default flex-col items-center gap-6 px-12 py-4">
              <h1 className="text-left font-lobster text-2xl text-influencer lg:text-4xl">
                Influencer Markt
              </h1>
              <div className="text-center font-playfair text-3xl font-semibold">
                {t("pages.contactUs.modalTitle")}
              </div>
              <div>{t("pages.contactUs.modalSubTitle")}</div>
              <Link href="/faq">
                <Button
                  title={t("pages.contactUs.modalButton")}
                  level="primary"
                />
              </Link>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export { ContactUsPage };
