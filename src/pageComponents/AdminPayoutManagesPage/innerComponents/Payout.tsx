import { useState } from "react";
import { helper } from "../../../utils/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

type Payout = {
  id: string;
  payoutValue: number;
  orderId: string;
};

const Payout = (params: { payout: Payout }) => {
  const [openPayout, setOpenPayout] = useState<boolean>(false);

  return (
    <div
      key={params.payout.id}
      className="flex flex-col rounded-xl border-[1px] p-4"
      onClick={() => setOpenPayout(!openPayout)}
    >
      <div className="flex cursor-pointer justify-between">
        <div
          className={`line-clamp-1 flex w-full flex-col gap-2 p-2 ${
            openPayout ? "border-b-[1px]" : ""
          }`}
        >
          <div className="font-semibold text-influencer">Payout Ref</div>
          <div>#{params.payout.id}</div>
        </div>
        <FontAwesomeIcon icon={!openPayout ? faChevronDown : faChevronUp} />
      </div>
      {openPayout && (
        <div>
          <div className="line-clamp-1 flex flex-col gap-2 p-2">
            <div className="font-semibold text-influencer">Payout Value</div>
            <div>
              {helper.calculerMonetaryValue(params.payout.payoutValue)}€
            </div>
          </div>
          <div className="line-clamp-1 flex flex-col gap-2 p-2">
            <div className="font-semibold text-influencer">Payout Order Id</div>
            <div>{params.payout.orderId}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export { Payout };
