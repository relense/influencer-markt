import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { api } from "~/utils/api";

import { LoadingSpinner } from "./LoadingSpinner";
import { helper } from "../utils/helper";
import Link from "next/link";

type Notification = {
  id: number;
  actorProfilePicture: string;
  notificationTypeId: number;
  entityId: number;
  notificationEntity: string;
  actorName: string;
  notificationCreatedAt: Date;
};

const Notifications = () => {
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsTotal, setNotificationsTotal] = useState<number>(0);
  const [notificationsCursor, setNotificationsCursor] = useState<number>(-1);

  const {
    data: notificationsData,
    isLoading: isLoadingNotificationsData,
    isRefetching: isRefetchingNotificationsData,
    refetch: refetchNotificationsData,
  } = api.notifications.getUserNotifications.useQuery(undefined, {
    enabled: false,
    cacheTime: 0,
  });

  const {
    data: notificationsDataCursor,
    isRefetching: isRefetchingNotificationsDataCursor,
    refetch: refetchNotificationsDataCursor,
  } = api.notifications.getUserNotificationsCursor.useQuery(
    { cursor: notificationsCursor },
    { enabled: false }
  );

  useEffect(() => {
    if (notificationsData) {
      setNotificationsTotal(notificationsData[0]);
      setNotifications(
        notificationsData[1].map((notification) => {
          return {
            actorName: notification.actor.name,
            actorProfilePicture: notification.actor.profilePicture,
            id: notification.id,
            notificationCreatedAt: notification.createdAt,
            notificationTypeId: notification.notificationTypeId,
            entityId: notification.entityId,
            notificationEntity: notification.notificationType.entityType,
          };
        })
      );

      const lastNotificationArray =
        notificationsData[1][notificationsData[1].length - 1];

      if (lastNotificationArray) {
        setNotificationsCursor(lastNotificationArray.id);
      }
    }
  }, [notificationsData]);

  useEffect(() => {
    if (notificationsDataCursor) {
      const newNotifications: Notification[] = [...notifications];

      notificationsDataCursor.forEach((notification) => {
        newNotifications.push({
          actorName: notification.actor.name,
          actorProfilePicture: notification.actor.profilePicture,
          id: notification.id,
          notificationCreatedAt: notification.createdAt,
          notificationTypeId: notification.notificationTypeId,
          entityId: notification.entityId,
          notificationEntity: notification.notificationType.entityType,
        });
      });

      setNotifications(newNotifications);

      const lastNotificationArray =
        notificationsDataCursor[notificationsDataCursor.length - 1];

      if (lastNotificationArray) {
        setNotificationsCursor(lastNotificationArray.id);
      }
    }
  }, [notifications, notificationsDataCursor]);

  useEffect(() => {
    void refetchNotificationsData();
  }, [refetchNotificationsData]);

  useEffect(() => {
    const container = containerRef.current;
    const handleScroll = () => {
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;

        if (scrollTop + clientHeight >= scrollHeight - 10) {
          if (notificationsTotal > notifications.length) {
            void refetchNotificationsDataCursor();
          }
        }
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [
    notifications.length,
    notificationsTotal,
    refetchNotificationsDataCursor,
  ]);

  const renderNotifications = () => {
    if (notifications) {
      if (notifications.length > 0) {
        return (
          <div className="flex flex-col">
            {notifications?.map((notification) => {
              return (
                <Link
                  href={`/${notification.notificationEntity}/${notification.entityId}`}
                  key={notification.id}
                  className="flex cursor-pointer items-center gap-4 px-4 py-6 hover:bg-white1"
                >
                  <Image
                    src={notification.actorProfilePicture || ""}
                    alt="profile picture"
                    width={1000}
                    height={1000}
                    quality={100}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-2 text-sm">
                    <div>
                      {t(
                        `general.notificationsMessages.${getNotificationMessageKey(
                          notification.notificationTypeId
                        )}`,
                        { actor: notification.actorName }
                      )}
                    </div>
                    <div className="text-gray2">
                      {helper.formatDate(
                        notification.notificationCreatedAt,
                        i18n.language
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
            {isRefetchingNotificationsDataCursor && (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div className="flex flex-1 flex-col gap-2 p-4 text-gray2">
            <FontAwesomeIcon icon={faBell} className="fa-xl cursor-pointer" />
            <div className="text-center">
              {t("components.notification.noNotifications")}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="absolute right-1 top-14 z-50 flex h-auto w-auto flex-col gap-4 overflow-hidden rounded-2xl border-[1px] border-white1 bg-white shadow-lg sm:right-16 lg:top-20">
      <div
        className="h-96 w-72 overflow-y-auto xxs:h-[550px] xxs:w-[330px] xs:h-[700px] xs:w-[350px] sm:w-[500px]"
        ref={containerRef}
      >
        {isLoadingNotificationsData || isRefetchingNotificationsData ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="p-4 ">
              <div className="text-lg">
                {t("components.notification.notifications")}
              </div>
            </div>
            <div className="w-full border-[1px] border-white1" />
            <div>{renderNotifications()}</div>
          </>
        )}
      </div>
    </div>
  );
};

export { Notifications };

const getNotificationMessageKey = (notificationsTypeId: number) => {
  if (notificationsTypeId === 1) {
    return "salesAwaitingReply";
  } else if (notificationsTypeId === 2) {
    return "ordersRejected";
  } else if (notificationsTypeId === 3) {
    return "ordersAccepted";
  } else if (notificationsTypeId === 4) {
    return "ordersDelivered";
  } else if (notificationsTypeId === 5) {
    return "salesCanceled";
  } else {
    return "";
  }
};
