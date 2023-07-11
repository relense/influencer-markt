import Image from "next/image";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const { t } = useTranslation();

  const renderMission = () => {
    return (
      <>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex h-auto flex-col gap-12 text-center lg:h-80 lg:flex-row">
            <div className="flex flex-1 text-center font-playfair text-5xl font-semibold lg:text-left">
              {t("pages.about.title")}
            </div>
            <div className="flex flex-1 flex-col justify-center text-center lg:text-left">
              {t("pages.about.subTitle")}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <Image
              src={
                "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
              }
              height={880}
              width={1173}
              alt="Photo by Jeremy Bishop on Unsplash"
              className="hidden object-contain lg:block"
            />
            <Image
              src={
                "https://images.unsplash.com/photo-1607895522985-af2e640b6f6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
              }
              height={880}
              width={1173}
              alt="Photo by Jeremy Bishop on Unsplash"
              className="block object-contain lg:hidden"
            />
            <div className="flex flex-1 justify-center text-center font-playfair text-3xl lg:text-4xl">
              {t("pages.about.photoSubTitle")}
            </div>
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderSelfPromo = () => {
    return (
      <>
        <div className="flex flex-1 flex-col gap-12">
          <div className="flex h-auto flex-col gap-12 text-center lg:h-80 lg:flex-row">
            <div className="flex flex-1 text-center font-playfair text-5xl font-semibold lg:text-left">
              {t("pages.about.selfPromoTitle")}
            </div>
            <div className="flex flex-1 flex-col justify-around gap-6 lg:gap-0">
              <div className="text-center text-lg font-medium lg:text-left">
                {t("pages.about.selfPromoSubTitle")}
              </div>
              <div className="text-center lg:text-left">
                {t("pages.about.selfPromoText")}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full border-[1px] border-white1" />
      </>
    );
  };

  const renderMeetOurTeam = () => {
    return (
      <div className="flex flex-1 flex-col gap-12">
        <div className="text-center font-playfair text-5xl font-semibold lg:text-left">
          {t("pages.about.meetTeamTitle")}
        </div>
        <div className="flex flex-1 flex-col justify-center gap-12 lg:flex-row lg:gap-32">
          <div className="flex flex-col items-center justify-center gap-2">
            <Image
              src={
                "https://images.unsplash.com/photo-1500259783852-0ca9ce8a64dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80"
              }
              height={600}
              width={338}
              alt="Photo by Jeremy Bishop on Unsplash"
              className="rounded-lg object-contain"
            />
            <div className="flex flex-col gap-2 text-center">
              <div className="text-xl font-medium">Miguel Furtado</div>
              <div className="font-medium text-gray2">
                {t("pages.about.coFounder")}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <Image
              src={
                "https://images.unsplash.com/photo-1500259783852-0ca9ce8a64dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80"
              }
              height={600}
              width={338}
              alt="Photo by Jeremy Bishop on Unsplash"
              className="rounded-lg object-contain"
            />
            <div className="flex flex-col gap-2 text-center">
              <div className="text-xl font-medium">Nuno Anacleto</div>
              <div className="font-medium text-gray2">
                {t("pages.about.coFounder")}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center gap-16 p-4 xl:w-3/4 xl:self-center 2xl:w-2/4">
      {renderMission()}
      {renderSelfPromo()}
      {renderMeetOurTeam()}
    </div>
  );
};

export { AboutPage };
