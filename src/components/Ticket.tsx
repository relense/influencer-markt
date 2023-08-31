import { useState } from "react";
import { type TicketType } from "../utils/globalTypes";
import { helper } from "../utils/helper";
import { useTranslation } from "react-i18next";

const Ticket = (params: { ticket: TicketType }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-6 rounded-xl border-[1px] p-4">
      <div
        className="flex cursor-pointer gap-6"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex gap-2">
          <div className="font-semibold text-influencer">ID:</div>
          <div>{params.ticket.id}</div>
        </div>

        <div className="flex w-56 gap-2">
          <div className="font-semibold text-influencer">Reason:</div>
          <div title={params.ticket.reason?.name}>
            {params.ticket.reason?.name || ""}
          </div>
        </div>

        <div className="flex gap-2">
          <div className="font-semibold text-influencer">Message State:</div>
          <div>{params.ticket.contactMessageState?.name || ""}</div>
        </div>
        <div className="flex gap-2">
          <div className="font-semibold text-influencer">Created At:</div>
          <div>
            {helper.formatDate(params.ticket.createdAt, i18n.language) || ""}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="font-semibold text-influencer">Last Update:</div>
          <div>
            {helper.formatDate(params.ticket.updatedAt, i18n.language) || ""}
          </div>
        </div>
        {params.ticket.closedAt && (
          <div className="flex gap-2">
            <div className="font-semibold text-influencer">Closed At:</div>
            <div>
              {helper.formatDate(params.ticket.closedAt, i18n.language) || ""}
            </div>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="font-semibold text-influencer">Email:</div>
            <div>{params.ticket.email || ""}</div>
          </div>
          <div className="flex  gap-2">
            <div className="font-semibold text-influencer">Name:</div>
            <div title={params.ticket.name}>{params.ticket.name}</div>
          </div>
          <div className="flex gap-2">
            <div className="font-semibold text-influencer">Message</div>
            <div className="whitespace-pre-line">{params.ticket.message}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Ticket };
