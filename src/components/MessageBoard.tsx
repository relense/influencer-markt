import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

import { api } from "~/utils/api";
import { helper } from "../utils/helper";
import { LoadingSpinner } from "./LoadingSpinner";
import dayjs from "dayjs";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

type Message = {
  senderId: number;
  receiverId: number;
  id: number;
  message: string;
  createdAt: Date;
};

const MessageBoard = (params: {
  orderId: number;
  receiverId: number;
  senderId: number;
  orderStatusId: number;
}) => {
  const { t, i18n } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const ctx = api.useContext();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesCursor, setMessagesCursor] = useState<number>(-1);
  const [messagesTotal, setMessagesTotal] = useState<number>(0);
  const [userAddedNewMessages, setUserAddedNewMessages] = useState(false);
  const [manuallyFetchedMessages, setManuallyFetchedMessages] = useState(false);
  const [prevContainerHeight, setPrevContainerHeight] = useState<number>(0);
  const [fetchingInProgress, setFetchingInProgress] = useState(false);
  const [firstTime, setFirstTime] = useState(false);

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isRefetching: isRefetchingMessagesData,
    refetch: refetchMessagesData,
  } = api.messages.getOrderMessages.useQuery({
    orderId: params.orderId,
  });

  const { data: messagesDataCursor, refetch: refetchMessagesCursor } =
    api.messages.getOrderMessagesWithCursor.useQuery(
      {
        orderId: params.orderId,
        cursor: messagesCursor,
      },
      {
        enabled: false,
      }
    );

  const { mutate: createMessage } = api.messages.createMessage.useMutation({
    onSuccess: (message) => {
      if (message) {
        const newMessages = [...messages];

        newMessages.unshift({
          id: message?.id,
          createdAt: message?.createdAt,
          message: message?.message,
          receiverId: message?.receiverId,
          senderId: message?.senderId,
        });

        setMessages(newMessages);
        setUserAddedNewMessages(true);
      }
      setMessage("");
    },
  });

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData.messages);
      setMessagesTotal(messagesData.totalMessages);

      const lastMessageArray =
        messagesData.messages[messagesData.messages.length - 1];

      if (lastMessageArray) {
        setMessagesCursor(lastMessageArray.id);
      }

      setFirstTime(true);
    }
  }, [messagesData]);

  useEffect(() => {
    if (messagesDataCursor && messagesDataCursor.length > 0) {
      setMessages((prevMessages) => {
        return [
          ...prevMessages,
          ...messagesDataCursor.map((message) => ({
            id: message.id,
            createdAt: message.createdAt,
            message: message.message,
            receiverId: message.receiverId,
            senderId: message.senderId,
          })),
        ];
      });

      const lastMessageArray =
        messagesDataCursor[messagesDataCursor.length - 1];

      if (lastMessageArray) {
        setMessagesCursor(lastMessageArray.id);
      }
    }
  }, [messagesDataCursor]);

  useEffect(() => {
    const container = messagesRef.current;
    // In your scroll event listener:
    const handleScroll = () => {
      if (
        container &&
        container.scrollTop <= 300 &&
        messagesTotal > messages.length &&
        !manuallyFetchedMessages &&
        !fetchingInProgress // Check if a fetch is not already in progress
      ) {
        setFetchingInProgress(true); // Set the flag to indicate fetch is in progress

        // Fetch more messages
        void refetchMessagesCursor()
          .then(() => {
            setFetchingInProgress(false); // Reset the flag when fetch is complete
            setManuallyFetchedMessages(true);
            setPrevContainerHeight(container.scrollHeight);
          })
          .catch((error) => {
            console.error("Error fetching messages:", error);
            setFetchingInProgress(false); // Reset the flag on error as well
          });
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
    manuallyFetchedMessages,
    messages.length,
    messagesTotal,
    refetchMessagesCursor,
    fetchingInProgress, // Include the flag in the dependency array
  ]);

  useEffect(() => {
    if (messagesRef && messagesRef.current) {
      const container = messagesRef.current;

      // NEW MESSAGES
      if (userAddedNewMessages) {
        container.scrollTo(0, container.scrollHeight);
        setUserAddedNewMessages(false);

        // NEW FETCHED MESSAGES
      } else if (manuallyFetchedMessages) {
        container.scrollTop += container.scrollHeight - prevContainerHeight;
        setManuallyFetchedMessages(false);
      } else if (firstTime) {
        container.scrollTo(0, container.scrollHeight);
        setFirstTime(false);
      }
    }
  }, [
    userAddedNewMessages,
    manuallyFetchedMessages,
    prevContainerHeight,
    firstTime,
  ]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "59px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = (userMessage: string) => {
    if (userMessage !== "" && userMessage.trim()) {
      createMessage({
        message: userMessage,
        orderId: params.orderId,
        receiverId: params.receiverId || -1,
      });
    }
  };

  const renderMessages = () => {
    if (messages && messages.length > 0) {
      const reverseMessages = [...messages].reverse();
      return (
        <div className="flex flex-1 flex-col items-end justify-end">
          {reverseMessages.map((message, index) => {
            const data = [];

            if (
              dayjs(message.createdAt).isAfter(
                reverseMessages[index - 1]?.createdAt,
                "day"
              ) ||
              (messages.length === messagesTotal && index === 0)
            ) {
              data.push(
                <div
                  key={`${message.id}date`}
                  className="flex w-full items-center justify-center self-end text-sm font-semibold text-gray2"
                >
                  {helper.formatOnlyDate(message.createdAt, i18n.language)}
                </div>
              );
            }

            if (
              message.senderId === params.receiverId &&
              message.receiverId === params.senderId
            ) {
              data.push(
                <div
                  key={`${message.id}message`}
                  className="flex w-full flex-col items-start justify-end text-left"
                >
                  <div className="m-2 max-w-[75%] rounded-xl bg-boxShadow p-4 text-white">
                    {message.message}
                  </div>
                  <div className="flex justify-end text-sm text-gray2">
                    {helper.formatShowtime(message.createdAt, i18n.language)}
                  </div>
                </div>
              );
            } else if (
              message.receiverId === params.receiverId &&
              message.senderId === params.senderId
            ) {
              data.push(
                <div
                  key={`${message.id}message`}
                  className="flex w-full flex-col items-end justify-end text-left"
                >
                  <div className="m-2 max-w-[75%] rounded-xl bg-influencer-green-dark p-4 text-white">
                    {message.message}
                  </div>
                  <div className="flex justify-end text-sm text-gray2">
                    {helper.formatShowtime(message.createdAt, i18n.language)}
                  </div>
                </div>
              );
            }

            return data;
          })}
        </div>
      );
    } else {
      return (
        <div className="flex flex-1 flex-col items-center justify-end text-gray2">
          <span>{t("components.messageBoard.noMessages")}</span>
          <span>{t("components.messageBoard.noMessagesSubtitle")}</span>
        </div>
      );
    }
  };

  let inputPlaceholder = t("components.messageBoard.sendMessageHere");
  let sendMessageIconClass = "fa-xl cursor-pointer";
  if (
    params.orderStatusId === 2 ||
    params.orderStatusId === 7 ||
    params.orderStatusId === 8
  ) {
    sendMessageIconClass = "fa-xl";
    inputPlaceholder = t("components.messageBoard.inputDisabled");
  }
  return (
    <div className="flex flex-1 flex-col items-center rounded-xl border-[1px] text-center">
      <div className="flex w-full items-center justify-between border-b-[1px] p-4">
        <div className="text-xl font-semibold ">
          {t("components.messageBoard.messages")}
        </div>
        <FontAwesomeIcon
          icon={faArrowsRotate}
          className="fa-xl cursor-pointer text-influencer"
          onClick={() => {
            void ctx.messages.getOrderMessagesWithCursor.reset();
            void refetchMessagesData();
          }}
        />
      </div>
      <div
        className="flex max-h-[500px] min-h-[500px] w-full flex-1 overflow-y-auto p-4 lg:min-h-[500px]"
        ref={messagesRef}
      >
        {isLoadingMessages || isRefetchingMessagesData ? (
          <div className="relative flex flex-1 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          renderMessages()
        )}
      </div>
      <div className="flex w-full items-center gap-2 border-t-[1px] p-4">
        <textarea
          ref={textareaRef}
          className="flex h-[59px] max-h-56 flex-1 resize-none overflow-y-auto rounded-xl border-[1px] bg-white1 p-2 pt-4 text-left text-base focus:border-[1px] focus:border-black focus:outline-none"
          value={message}
          onChange={handleMessageChange}
          disabled={
            params.orderStatusId === 2 ||
            params.orderStatusId === 7 ||
            params.orderStatusId === 8
          }
          placeholder={messages.length === 0 ? inputPlaceholder : ""}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(message);
              setMessage("");
            }
          }}
        />
        <FontAwesomeIcon
          icon={faPaperPlane}
          className={sendMessageIconClass}
          onClick={() => {
            if (
              params.orderStatusId !== 2 &&
              params.orderStatusId !== 7 &&
              params.orderStatusId !== 8
            ) {
              const currentMessage = message;
              handleSendMessage(currentMessage);
              setMessage("");
            }
          }}
        />
      </div>
    </div>
  );
};

export { MessageBoard };
