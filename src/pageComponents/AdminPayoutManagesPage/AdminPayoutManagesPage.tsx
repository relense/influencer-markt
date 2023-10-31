import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { api } from "~/utils/api";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Payout } from "./innerComponents/Payout";
import { helper } from "../../utils/helper";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type ObjectisList = {
  isCompanyCorrect: boolean;
  isTinCorrect: boolean;
  isCompanyCountryCorrect: boolean;
  isInvoiceBaseValueCorrect: boolean;
  isTaxCorrect: boolean;
  isTotalValueCorrect: boolean;
  isTypeOfPaymentCorrect: boolean;
};

const AdminPayoutManagesPage = (params: { payoutInvoiceId: string }) => {
  const { t, i18n } = useTranslation();
  const ctx = api.useContext();
  const { data: sessionData } = useSession();
  const router = useRouter();

  const [openPayoutsList, setOpenPayoutsList] = useState<boolean>(false);
  const [editAssignedAdmin, setEditAssignedAdmin] = useState<boolean>(false);
  const [currentAssignedAdminName, setCurrentAssignedAdminName] =
    useState<string>("");
  const [currentAssignAdminId, setCurrentAssingAdminId] = useState<string>("");
  const [openRejectModal, setOpenRejectModal] = useState<boolean>(false);

  const { register, handleSubmit, watch } = useForm<ObjectisList>({
    defaultValues: {
      isCompanyCorrect: false,
      isTinCorrect: false,
      isCompanyCountryCorrect: false,
      isInvoiceBaseValueCorrect: false,
      isTaxCorrect: false,
      isTotalValueCorrect: false,
      isTypeOfPaymentCorrect: false,
    },
  });

  const { data: payoutInvoice, isLoading: isLoadingPayoutInvoice } =
    api.payoutInvoices.getPayoutInvoice.useQuery(
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

  const { mutate: acceptInvoice } =
    api.payoutInvoices.acceptInvoice.useMutation({
      onSuccess: () => {
        void router.push("/admin/payouts");
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

  const handleRejectInvoice = () => {
    setOpenRejectModal(false);
  };

  const rejectButtonDisable = () => {
    if (payoutInvoice?.isentOfTaxes) {
      if (
        watch("isCompanyCorrect") &&
        watch("isTinCorrect") &&
        watch("isCompanyCountryCorrect") &&
        watch("isInvoiceBaseValueCorrect") &&
        watch("isTotalValueCorrect")
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        watch("isCompanyCorrect") &&
        watch("isTinCorrect") &&
        watch("isCompanyCountryCorrect") &&
        watch("isInvoiceBaseValueCorrect") &&
        watch("isTaxCorrect") &&
        watch("isTotalValueCorrect")
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  const acceptButtonDisable = () => {
    if (payoutInvoice?.isentOfTaxes) {
      if (
        !watch("isCompanyCorrect") ||
        !watch("isTinCorrect") ||
        !watch("isCompanyCountryCorrect") ||
        !watch("isInvoiceBaseValueCorrect") ||
        !watch("isTotalValueCorrect") ||
        sessionData?.user.id !== payoutInvoice?.payoutSolver?.id
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (
        !watch("isCompanyCorrect") ||
        !watch("isTinCorrect") ||
        !watch("isCompanyCountryCorrect") ||
        !watch("isInvoiceBaseValueCorrect") ||
        !watch("isTaxCorrect") ||
        !watch("isTotalValueCorrect") ||
        sessionData?.user.id !== payoutInvoice?.payoutSolver?.id
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleAcceptPayout = handleSubmit((data) => {
    if (
      sessionData?.user.id === payoutInvoice?.payoutSolver?.id &&
      payoutInvoice
    ) {
      void acceptInvoice({
        payoutsInvoiceId: payoutInvoice.id,
        isPayoutValueCorect: data.isTotalValueCorrect,
        isVATCorrect: data.isTaxCorrect,
        isOurTinCorrect: data.isTinCorrect,
        isOurCountryCorrect: data.isCompanyCountryCorrect,
        isCompanyNameCorrect: data.isCompanyCorrect,
        correctTypeOfPaymentSelected: data.isTypeOfPaymentCorrect,
      });
    }
  });

  const handleClickUsernameAssigned = () => {
    if (
      sessionData?.user?.id === currentAssignAdminId &&
      (payoutInvoice?.payoutInvoiceStatusId === 1 ||
        payoutInvoice?.payoutInvoiceStatusId === 2)
    ) {
      setEditAssignedAdmin(true);
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
          <div className="text-2xl font-semibold">Invoice Information</div>
          <div className="line-clamp-1 flex flex-col gap-2 border-b-[1px] p-2">
            <div className="font-semibold text-influencer">Invoice Ref</div>
            <div>#{payoutInvoice.id}</div>
          </div>
          <div className="line-clamp-1 flex flex-col gap-2 border-b-[1px] p-2">
            <div className="font-semibold text-influencer">
              Invoice Download Link
            </div>
            <Link
              href={payoutInvoice.influencerInvoice}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Download
            </Link>
          </div>
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
          <div className="line-clamp-1 flex flex-col gap-2 border-b-[1px] p-2">
            <div className="font-semibold text-influencer">
              Is isent of tax?
            </div>
            <div>{payoutInvoice?.isentOfTaxes ? "Yes" : "No"}</div>
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
                  icon={!openPayoutsList ? faChevronDown : faChevronUp}
                />
              </div>
              <div>Total {payoutInvoice.payouts.length}</div>
            </div>
            {openPayoutsList && renderPayoutList()}
          </div>
          <div className="line-clamp-1 flex flex-col gap-2 border-b-[1px] p-2">
            <div className="font-semibold text-influencer">Influencer</div>
            <div>{payoutInvoice?.payouts[0]?.name || ""}</div>
          </div>
          <div className="line-clamp-1 flex flex-col gap-2 p-2">
            <div className="font-semibold text-influencer">
              Influencer Email
            </div>
            <div>{payoutInvoice?.payouts[0]?.email || ""}</div>
          </div>
        </div>
      );
    }
  };

  const renderPayoutList = () => {
    return (
      <div className="flex flex-1 flex-col gap-2">
        {payoutInvoice?.payouts.map((payout) => {
          return (
            <Payout
              key={payout.id}
              payout={{
                id: payout.id,
                orderId: payout.orderId.toString(),
                payoutValue: payout.payoutValue,
              }}
            />
          );
        })}
      </div>
    );
  };

  const renderDecisionAndObjectivesMenu = () => {
    return (
      <div className="flex w-full flex-1 flex-col items-center gap-12 rounded-xl border-[1px] p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center text-2xl font-semibold">
            Objetives to list
          </div>
          <div className="text-center text-lg font-semibold">
            After downloading the influencers invoice, be sure to check that all
            the fields are absolutely correct
          </div>
        </div>
        <form
          id="objectives-form"
          onSubmit={handleAcceptPayout}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-2">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                {...register("isCompanyCorrect")}
                type="checkbox"
                className="peer sr-only"
                readOnly
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-influencer-green-dark peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-influencer-green-super-light" />
            </label>
            <span className="ml-2 text-xl font-medium text-gray-900">
              Is our company name correct?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                {...register("isTinCorrect")}
                type="checkbox"
                className="peer sr-only"
                readOnly
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-influencer-green-dark peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-influencer-green-super-light" />
            </label>
            <span className="ml-2 text-xl font-medium text-gray-900">
              Is our TIN correct?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                {...register("isCompanyCountryCorrect")}
                type="checkbox"
                className="peer sr-only"
                readOnly
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-influencer-green-dark peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-influencer-green-super-light" />
            </label>
            <span className="ml-2 text-xl font-medium text-gray-900">
              Is our company country correct?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                {...register("isInvoiceBaseValueCorrect")}
                type="checkbox"
                className="peer sr-only"
                readOnly
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-influencer-green-dark peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-influencer-green-super-light" />
            </label>
            <span className="ml-2 text-xl font-medium text-gray-900">
              Is invoice base value correct?
            </span>
          </div>
          {!payoutInvoice?.isentOfTaxes && (
            <div className="flex items-center gap-2">
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  {...register("isTaxCorrect")}
                  type="checkbox"
                  className="peer sr-only"
                  readOnly
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-influencer-green-dark peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-influencer-green-super-light" />
              </label>
              <span className="ml-2 text-xl font-medium text-gray-900">
                Is tax correct?
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                {...register("isTotalValueCorrect")}
                type="checkbox"
                className="peer sr-only"
                readOnly
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-influencer-green-dark peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-influencer-green-super-light" />
            </label>
            {payoutInvoice?.isentOfTaxes ? (
              <span className="ml-2 text-xl font-medium text-gray-900">
                Is total value correct?
              </span>
            ) : (
              <span className="ml-2 text-xl font-medium text-gray-900">
                Is total value with tax included correct?
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                {...register("isTypeOfPaymentCorrect")}
                type="checkbox"
                className="peer sr-only"
                readOnly
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-influencer-green-dark peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-influencer-green-super-light" />
            </label>
            <span className="ml-2 text-xl font-medium text-gray-900">
              Is type of payment correct?
            </span>
          </div>
        </form>

        <div className="flex gap-4">
          <Button
            title="Reject Invoice"
            level="primary"
            onClick={() => setOpenRejectModal(true)}
            disabled={rejectButtonDisable()}
          />
          <Button
            title="Accept Payout"
            level="terciary"
            disabled={acceptButtonDisable()}
            form="objectives-form"
          />
        </div>
      </div>
    );
  };

  const renderCorrectInformationExample = () => {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border-[1px] p-4 text-center">
        <div className="flex text-2xl font-semibold">Useful information</div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="font-semibold text-influencer">Our company name</div>
          <div>Influencer Markt, LDA</div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="font-semibold text-influencer">Tax percentage</div>
          <div>23%</div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="font-semibold text-influencer">Our company TIN</div>
          <div>214341</div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="font-semibold text-influencer">
            Our company country
          </div>
          <div>Portugal</div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="font-semibold text-influencer">Payment Type</div>
          <div>Pagamento dos bens ou dos serviços</div>
        </div>
      </div>
    );
  };

  const renderTitle = () => {
    if (payoutInvoice && adminUsersData) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 p-4 text-center text-lg md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col gap-4">
            <div className="flex cursor-pointer flex-col items-center gap-2 md:flex-row">
              <span className="font-semibold text-influencer">Assigned To</span>
              <span onClick={() => handleClickUsernameAssigned()}>
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

  const renderRejectModal = () => {
    return (
      <div className="flex justify-center">
        <Modal onClose={() => setOpenRejectModal(false)}>
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
            <div className="text-center text-2xl font-semibold">
              Are you sure this invoice is incorrect?
            </div>
            <div className="flex items-center justify-center px-12 text-justify">
              Please be absolutely sure that nothing is missing or incorrect
              before proceeding with the rejection. Your attention to detail is
              crucial in ensuring smooth operations.
            </div>
            <Button
              title="Reject Invoice"
              level="primary"
              onClick={() => handleRejectInvoice()}
            />
          </div>
        </Modal>
      </div>
    );
  };

  if (isLoadingPayoutInvoice) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <div className="flex w-full flex-col gap-4 self-center p-4 md:w-9/12">
        {renderTitle()}

        <div className="flex flex-col justify-center gap-4 md:flex-row">
          <div className="">{renderPayoutInvoiceDetails()}</div>
          <div>
            <div className="mb-4 flex flex-1">
              {payoutInvoice?.payoutInvoiceStatusId === 2 &&
                renderDecisionAndObjectivesMenu()}
            </div>
          </div>
          <div>
            <div className="flex flex-1">
              {renderCorrectInformationExample()}
            </div>
          </div>
        </div>
        {openRejectModal && renderRejectModal()}
      </div>
    );
  }
};

export { AdminPayoutManagesPage };
