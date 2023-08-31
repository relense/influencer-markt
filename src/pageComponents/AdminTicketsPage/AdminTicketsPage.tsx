import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { api } from "~/utils/api";

import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Button } from "../../components/Button";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import { CustomSelect } from "../../components/CustomSelect";
import type { TicketType, Option } from "../../utils/globalTypes";
import { Ticket } from "../../components/Ticket";

type TicketSearch = {
  searchTicketId: string;
  searchEmail: string;
  ticketReason: Option;
  ticketState: Option;
};

const AdminTicketsPage = () => {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [ticketsCursor, setTicketsCursor] = useState<number>(-1);
  const [ticketsCount, setTicketsCount] = useState<number>(0);
  const [ticketIdSearch, setTicketIdSearch] = useState<string>("");
  const [ticketEmailSearch, setTicketEmailSearch] = useState<string>("");
  const [ticketReasonId, setTicketReasonId] = useState<number>(-1);
  const [ticketStateId, setTicketStateId] = useState<number>(-1);

  const { register, handleSubmit, reset, control } = useForm<TicketSearch>({
    defaultValues: {
      searchTicketId: "",
      searchEmail: "",
      ticketReason: { id: -1, name: "" },
      ticketState: { id: -1, name: "" },
    },
  });

  const { data: reasons } = api.allRoutes.getAllReasons.useQuery();
  const { data: contactMessageState } =
    api.allRoutes.getAllContactMessageStatus.useQuery();

  const { data: ticketsData, isLoading: isLoadingTickets } =
    api.contactMessage.getMessages.useQuery(
      {
        ticketId: ticketIdSearch,
        ticketEmail: ticketEmailSearch,
        ticketReasonId: ticketReasonId,
        ticketStateId: ticketStateId,
      },
      {
        cacheTime: 0,
      }
    );

  const {
    data: ticketsCursorData,
    isFetching: isFetchingTicketsWithCursor,
    refetch: refetchTicketWithCursor,
  } = api.contactMessage.getMessagesCursor.useQuery(
    {
      cursor: ticketsCursor,
      ticketId: ticketIdSearch,
      ticketEmail: ticketEmailSearch,
      ticketReasonId: ticketReasonId,
      ticketStateId: ticketStateId,
    },
    {
      enabled: false,
      cacheTime: 0,
    }
  );

  useEffect(() => {
    if (ticketsData) {
      setTickets(ticketsData[1]);
      setTicketsCount(ticketsData[0]);

      const lastTicketInArray = ticketsData[1][ticketsData[1].length - 1];

      if (lastTicketInArray) {
        setTicketsCursor(lastTicketInArray.id);
      }
    }
  }, [ticketsData]);

  useEffect(() => {
    if (ticketsCursorData) {
      const newTickets: TicketType[] = [...tickets];

      ticketsCursorData.forEach((ticket: TicketType) => {
        newTickets.push(ticket);
      });

      setTickets(newTickets);

      const lastTicketInArray = ticketsCursorData[ticketsCursorData.length - 1];

      if (lastTicketInArray) {
        setTicketsCursor(lastTicketInArray.id);
      }
    }
  }, [tickets, ticketsCursorData]);

  const submit = handleSubmit((data) => {
    setTicketIdSearch(data.searchTicketId);
    setTicketEmailSearch(data.searchEmail);
    setTicketReasonId(data.ticketReason.id);
    setTicketStateId(data.ticketState.id);
  });

  const clearFilters = () => {
    setTicketIdSearch("");
    setTicketEmailSearch("");
    setTicketReasonId(-1);
    setTicketStateId(-1);

    reset();
  };

  const renderInputs = () => {
    return (
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4 lg:flex-row">
          <div className="flex flex-1 flex-col">
            <span className="font-semibold">Ticket ID Search</span>
            <input
              {...register("searchTicketId")}
              type="text"
              className="h-full w-full rounded-lg border-[1px] p-4"
            />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="font-semibold">Email Search</span>
            <input
              {...register("searchEmail")}
              type="text"
              className="h-full w-full rounded-lg border-[1px] p-4"
            />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="font-semibold">Reason Search</span>

            <Controller
              name="ticketReason"
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <CustomSelect
                    register={register}
                    name="ticketReason"
                    placeholder="Reason"
                    options={reasons?.map((reason) => {
                      return { id: reason.id, name: reason.name };
                    })}
                    value={value}
                    handleOptionSelect={onChange}
                  />
                );
              }}
            />
          </div>
          <div className="flex flex-1 flex-col">
            <span className="font-semibold">Ticket State</span>

            <Controller
              name="ticketState"
              control={control}
              render={({ field: { value, onChange } }) => {
                return (
                  <CustomSelect
                    register={register}
                    name="ticketState"
                    placeholder="State"
                    options={contactMessageState?.map((ticketState) => {
                      return { id: ticketState.id, name: ticketState.name };
                    })}
                    value={value}
                    handleOptionSelect={onChange}
                  />
                );
              }}
            />
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <Button level="primary" title="Search" />
        </div>
      </div>
    );
  };

  const renderFiltersRow = () => {
    return (
      <div
        className="flex cursor-pointer items-center justify-end gap-2"
        onClick={() => clearFilters()}
      >
        <FontAwesomeIcon icon={faClose} />
        <div>Clear Filters</div>
      </div>
    );
  };

  const renderTickets = () => {
    return (
      <div className="flex flex-col gap-4">
        {tickets &&
          tickets.map((ticket) => {
            return <Ticket key={ticket.id} ticket={ticket} />;
          })}
      </div>
    );
  };

  return (
    <div className="flex w-full cursor-default flex-col gap-6 self-center px-4 pb-10 sm:px-12 xl:w-3/4 2xl:w-3/4 3xl:w-2/4">
      <div className="flex flex-col gap-16">
        <form onSubmit={submit} className="flex flex-col gap-4">
          {renderInputs()}
          {renderFiltersRow()}
        </form>
        {isLoadingTickets ? (
          <div className="flex flex-1 justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          renderTickets()
        )}
        {ticketsCount > tickets.length && (
          <div className="flex items-center justify-center">
            <Button
              title="load More"
              onClick={() => refetchTicketWithCursor()}
              isLoading={isFetchingTicketsWithCursor}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export { AdminTicketsPage };
