import { api } from "~/utils/api";

const AdminPayoutManagesPage = (params: { payoutInvoiceId: string }) => {
  const payoutInvoice = api.payoutInvoices.getPayoutInvoice.useQuery({
    payoutInvoiceId: params.payoutInvoiceId,
  });

  return (
    <div className="flex w-full flex-col gap-4 self-center p-4 md:w-10/12">
      Adamin Payout Manage PAge
    </div>
  );
};

export { AdminPayoutManagesPage };
