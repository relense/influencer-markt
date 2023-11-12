import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

import { type Option } from "../../../utils/globalTypes";
import { useSession } from "next-auth/react";

const Categories = (params: {
  categories: Option[];
  profileUserId: string;
}) => {
  const { t } = useTranslation();
  const session = useSession();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="text-2xl font-semibold">
          {t("pages.publicProfilePage.categories")}
        </div>
        {session.data?.user.id === params.profileUserId && (
          <FontAwesomeIcon
            icon={faPencil}
            className="fa-xl cursor-pointer text-influencer"
            onClick={() => console.log("")}
          />
        )}
      </div>
      <div className="flex flex-wrap gap-4">
        {params.categories.map((category) => {
          return (
            <div
              key={category.id}
              className="rounded-2xl border-[1px] border-gray2 px-4 py-1"
            >
              {t(`general.categories.${category.name}`)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { Categories };
