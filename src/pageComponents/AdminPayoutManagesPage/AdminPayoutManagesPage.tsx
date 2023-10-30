import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

import { Payout } from "./innerComponents/Payout";
import { helper } from "../../utils/helper";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

const AdminPayoutManagesPage = (params: { payoutInvoiceId: string }) => {
  const { t, i18n } = useTranslation();
  const ctx = api.useContext();

  const [openPayoutsList, setOpenPayoutsList] = useState<boolean>(false);
  const [editAssignedAdmin, setEditAssignedAdmin] = useState<boolean>(false);

  const [currentAssignedAdminName, setCurrentAssignedAdminName] =
    useState<string>("");
  const [currentAssignAdminId, setCurrentAssingAdminId] = useState<string>("");

  const { data: payoutInvoice } = api.payoutInvoices.getPayoutInvoice.useQuery(
    {
      payoutInvoiceId: params.payoutInvoiceId,
    },
    {
      cacheTime: 0,
    }
  );

  const { data: adminUsersData } = api.users.getAdminUsers.useQuery();

  const { mutate: updatePayoutSolver } =
    api.payoutInvoices.updatePayoutSolver.useMutation({
      onSuccess: (payoutInvoice) => {
        if (payoutInvoice) {
          setCurrentAssingAdminId(payoutInvoice?.payoutSolver?.id || "");
          setEditAssignedAdmin(false);
          setCurrentAssignedAdminName(
            payoutInvoice?.payoutSolver?.username || ""
          );
          void ctx.payoutInvoices.getPayoutInvoice.invalidate();
        }
      },
    });

  useEffect(() => {
    if (payoutInvoice) {
      setCurrentAssingAdminId(payoutInvoice?.payoutSolver?.id || "");
      setCurrentAssignedAdminName(payoutInvoice?.payoutSolver?.username || "");
    }
  }, [payoutInvoice]);

  const handleAdminChange = (adminId: string) => {
    if (payoutInvoice) {
      void updatePayoutSolver({
        payoutsInvoiceId: payoutInvoice?.id,
        adminId: adminId,
      });
    }
  };

  const renderPayoutInvoiceDetails = () => {
    if (payoutInvoice && payoutInvoice.payouts) {
      const totalPayoutsValue = payoutInvoice.payouts.reduce(
        (total, payout) => {
          return total + payout.payoutValue;
        },
        0
      );

      const totalPayoutsValueWithTax =
        totalPayoutsValue +
        totalPayoutsValue *
          ((payoutInvoice.payouts[0]?.profile?.country?.countryTax || 0) / 100);

      return (
        <div
          key={payoutInvoice.id}
          className={`flex flex-1 flex-col gap-2 rounded-xl border-[1px] p-4 text-sm`}
        >
          <div className="line-clamp-1 flex flex-col gap-2 border-b-[1px] p-2">
            <div className="font-semibold text-influencer">Uploaded Date</div>
            <div>
              {helper.formatFullDateWithTime(
                payoutInvoice.createdAt,
                i18n.language
              )}
            </div>
          </div>
          <div className="line-clamp-1 flex flex-col gap-2 border-b-[1px] p-2">
            <div className="font-semibold text-influencer">Invoice Value</div>
            <div>{helper.calculerMonetaryValue(totalPayoutsValue)}€</div>
          </div>
          <div className="line-clamp-1 flex flex-col gap-2 border-b-[1px] p-2">
            <div className="font-semibold text-influencer">
              Invoice Value With Tax
            </div>
            <div>{helper.calculerMonetaryValue(totalPayoutsValueWithTax)}€</div>
          </div>
          <div className="flex flex-col gap-2 border-b-[1px] p-2">
            <div
              className="line-clamp-1 flex cursor-pointer flex-col gap-2"
              onClick={() => setOpenPayoutsList(!openPayoutsList)}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-influencer">
                  Payouts List
                </div>
                <FontAwesomeIcon
                  icon={openPayoutsList ? faChevronDown : faChevronUp}
                />
              </div>
              <div>Total {payoutInvoice.payouts.length}</div>
            </div>
            {openPayoutsList && renderPayoutList()}
          </div>
          <div className="line-clamp-1 flex flex-col gap-2 p-2">
            <div className="font-semibold text-influencer">Influencer</div>
            <div>{payoutInvoice?.payouts[0]?.name || ""}</div>
          </div>
        </div>
      );
    }
  };

  const renderPayoutList = () => {
    return (
      <div className="flex flex-1 flex-col gap-2">
        {payoutInvoice?.payouts.map((payout) => {
          return <Payout key={payout.id} payout={payout} />;
        })}
      </div>
    );
  };

  const renderDecisionAndObjectivesMenu = () => {
    return (
      <div className="flex w-full flex-1 rounded-xl border-[1px] p-4">
        <div className="flex flex-1 justify-center font-semibold text-influencer">
          Objetives to fullfill
        </div>
      </div>
    );
  };

  const renderTitle = () => {
    if (payoutInvoice && adminUsersData) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 p-4 text-center text-lg md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 md:flex-row">
              <span className="font-semibold text-influencer">
                {t(
                  `adminPages.adminPayout.${
                    payoutInvoice?.payoutInvoiceStatus.name || ""
                  }`
                )}
              </span>
              <span>#{payoutInvoice.id}</span>
            </div>

            <div className="flex cursor-pointer flex-col items-center gap-2 md:flex-row">
              <span className="font-semibold text-influencer">Assigned To</span>
              <span onClick={() => setEditAssignedAdmin(true)}>
                {!editAssignedAdmin && currentAssignedAdminName}
              </span>
              {editAssignedAdmin && (
                <>
                  <select
                    name="admins"
                    className="rounded-xl border-[1px] p-2 focus:outline-black"
                    value={currentAssignAdminId}
                    onChange={(e) => handleAdminChange(e.target.value)}
                  >
                    {adminUsersData.map((admin) => {
                      return (
                        <option key={admin.id} value={admin.id}>
                          {admin.username}
                        </option>
                      );
                    })}
                  </select>
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    onClick={() => setEditAssignedAdmin(false)}
                  />
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="font-semibold text-influencer">Status</div>
            <div>
              {t(
                `adminPages.adminPayout.${payoutInvoice.payoutInvoiceStatus.name}`
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 self-center p-4 md:w-9/12">
      {renderTitle()}
      <div className="flex flex-1 flex-col gap-4 md:flex-row">
        <div className="flex flex-1">{renderPayoutInvoiceDetails()}</div>
        <div className="flex flex-1">{renderDecisionAndObjectivesMenu()}</div>
      </div>
    </div>
  );
};

export { AdminPayoutManagesPage };
