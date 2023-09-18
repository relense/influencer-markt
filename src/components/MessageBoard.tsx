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
}) => {
  const { t, i18n } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesCursor, setMessagesCursor] = useState<number>(-1);
  const [messagesTotal, setMessagesTotal] = useState<number>(0);
  const [userAddedNewMessages, setUserAddedNewMessages] = useState(false);
  const [manuallyFetchedMessages, setManuallyFetchedMessages] = useState(false);
  const [prevContainerHeight, setPrevContainerHeight] = useState<number>(0);

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
        !manuallyFetchedMessages
      ) {
        void refetchMessagesCursor();
        setManuallyFetchedMessages(true);
        setPrevContainerHeight(container.scrollHeight);
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
  ]);

  useEffect(() => {
    if (messagesRef && messagesRef.current) {
      const container = messagesRef.current;
      const shouldScrollToBottom =
        container.scrollTop + container.clientHeight === container.scrollHeight;

      if (userAddedNewMessages) {
        // Scroll to the bottom only if new messages were added by the user and they are at the bottom
        container.scrollTo(0, container.scrollHeight);
        setUserAddedNewMessages(false);
      } else if (!shouldScrollToBottom && !manuallyFetchedMessages) {
        container.scrollTop = container.scrollHeight - container.clientHeight;
      } else {
        if (container.scrollHeight - prevContainerHeight !== 0) {
          debugger;
          container.scrollTop =
            container.scrollHeight - prevContainerHeight + container.scrollTop;
        }
      }
    }
  }, [
    messages,
    userAddedNewMessages,
    manuallyFetchedMessages,
    prevContainerHeight,
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

  const handleSendMessage = () => {
    if (message !== "" && message.trim()) {
      createMessage({
        message: message,
        orderId: params.orderId,
        receiverId: params.receiverId || -1,
      });
    }
  };

  const renderMessages = () => {
    if (messages) {
      const reverseMessages = [...messages].reverse();
      return (
        <div className="flex flex-1 flex-col items-end">
          {reverseMessages.map((message, index) => {
            const data = [];

            if (
              dayjs(message.createdAt).isAfter(
                reverseMessages[index - 1]?.createdAt,
                "day"
              ) ||
              index === 0
            ) {
              data.push(
                <div
                  key={`${message.id}date`}
                  className="flex w-full flex-1 items-center justify-center self-end text-sm font-semibold text-gray2"
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
                  className="flex w-full flex-col items-start"
                >
                  <div className="m-2 rounded-xl bg-boxShadow p-4 text-white">
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
                  className="flex w-full flex-col items-end justify-end "
                >
                  <div className="m-2 rounded-xl bg-influencer-green-dark p-4 text-white">
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
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center rounded-xl border-[1px] text-center">
      <div className="flex w-full items-center justify-between border-b-[1px] p-4">
        <div className="text-xl font-semibold ">
          {t("pages.sales.messages")}
        </div>
        <FontAwesomeIcon
          icon={faArrowsRotate}
          className="fa-xl cursor-pointer text-influencer"
          onClick={() => refetchMessagesData()}
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
          className="flex h-[59px] max-h-56 flex-1 resize-none overflow-y-auto rounded-xl border-[1px] p-2 pt-4 text-left text-base"
          value={message}
          onChange={handleMessageChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <FontAwesomeIcon
          icon={faPaperPlane}
          className="fa-xl cursor-pointer"
          onClick={() => handleSendMessage()}
        />
      </div>
    </div>
  );
};

export { MessageBoard };
