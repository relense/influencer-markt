import { useEffect, useState } from "react";
import { api } from "~/utils/api";

import { Button } from "../../components/Button";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const { t } = useTranslation();
  const ctx = api.useContext();

  const [username, setUsername] = useState<string>("");
  const [disableEmailNotifications, setDisableEmailNotifications] =
    useState<boolean>(false);
  const [disableAppNotifications, setDisableAppNotifications] =
    useState<boolean>(false);

  const { data: userInfo, isLoading: isLoadingUserInfo } =
    api.users.getUserInfo.useQuery();

  const { data: usernameVerification, refetch: usernameVerificationRefetch } =
    api.users.usernameExists.useQuery({
      username: username,
    });

  const { mutate: updateEmailNotifications } =
    api.users.updateEmailNotifications.useMutation({
      onSuccess: () => {
        toast.success(t("pages.settings.updateNotificationsSuccess"), {
          position: "bottom-left",
        });
      },
    });

  const { mutate: updateUsername, isLoading: isLoadingUpdateUsername } =
    api.users.updateUserName.useMutation({
      onSuccess: () => {
        setUsername("");
        void ctx.users.getUser.invalidate();
      },
    });

  useEffect(() => {
    if (userInfo) {
      setDisableAppNotifications(userInfo.disableAppNotifications);
      setDisableEmailNotifications(userInfo.disableEmailNotifications);
    }
  }, [userInfo]);

  const handleDisableEmailNotifications = () => {
    setDisableEmailNotifications(!disableEmailNotifications);
    updateEmailNotifications({
      disableApp: disableAppNotifications,
      disableEmail: !disableEmailNotifications,
    });
  };

  const handleDisableAppNotifications = () => {
    setDisableAppNotifications(!disableAppNotifications);
    updateEmailNotifications({
      disableApp: !disableAppNotifications,
      disableEmail: disableEmailNotifications,
    });
  };

  const renderGeneralSettingsMenu = () => {
    return (
      <div className="flex w-full flex-col justify-between gap-8">
        <div className="flex flex-col gap-6">
          <div className="text-4xl font-semibold">
            {t("pages.settings.generalSettings")}
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-xl font-medium">
              {t("pages.settings.updateUsername")}
            </div>
            <div className="flex w-full flex-col gap-2">
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                required
                placeholder={userInfo?.username || ""}
                type="text"
                className="flex h-14 flex-1 cursor-pointer rounded-lg border-[1px] border-gray3 bg-transparent p-4 placeholder-gray2 placeholder:w-11/12 focus:border-[1px] focus:border-black focus:outline-none"
                autoComplete="off"
                onKeyDown={() => {
                  void usernameVerificationRefetch();
                }}
              />
              {username && username.length > 0 && (
                <div className="ml-4 flex">
                  {usernameVerification === false &&
                    userInfo?.username !== username && (
                      <div className="text-influencer-green">
                        {t("pages.settings.pageNameAvailable")}
                      </div>
                    )}
                  {usernameVerification === true &&
                    userInfo?.username !== username && (
                      <div className="text-red-600">
                        {t("pages.settings.pageNameUnavailable")}
                      </div>
                    )}
                  {userInfo?.username === username && (
                    <div className="text-red-600">
                      {t("pages.settings.pageNameIsYours")}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex">
          <Button
            title={t("pages.settings.save")}
            level="primary"
            size="regular"
            isLoading={isLoadingUpdateUsername}
            disabled={
              usernameVerification === false ||
              userInfo?.username === username ||
              !username
            }
            onClick={() => updateUsername({ username: username })}
          />
        </div>
      </div>
    );
  };

  const renderNotificationsMenu = () => {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-4xl font-semibold">
          {t("pages.settings.notificationsSettings")}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                readOnly
                checked={disableEmailNotifications}
                onChange={() => handleDisableEmailNotifications()}
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-influencer-green-dark peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-influencer-green-super-light" />
            </label>
            <span className="ml-2 text-xl font-medium text-gray-900">
              {t("pages.settings.disableEmailNotifications")}
            </span>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                readOnly
                checked={disableAppNotifications}
                onChange={() => handleDisableAppNotifications()}
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-influencer-green-dark peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-influencer-green-super-light" />
            </label>
            <span className="ml-2 text-xl font-medium text-gray-900">
              {t("pages.settings.disableAppNotifications")}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const mobileView = () => {
    return (
      <div className="flex h-full flex-1 flex-col gap-12">
        {renderGeneralSettingsMenu()}
        {renderNotificationsMenu()}
      </div>
    );
  };

  if (isLoadingUserInfo) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <div className="flex w-full flex-1 cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 lg:w-full xl:w-10/12 2xl:w-3/4 3xl:w-3/4 4xl:w-7/12 5xl:w-2/4">
        {mobileView()}
      </div>
    );
  }
};

export { SettingsPage };
